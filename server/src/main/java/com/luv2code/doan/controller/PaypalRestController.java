package com.luv2code.doan.controller;

import com.amazonaws.services.opsworks.model.SelfUserProfile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.luv2code.doan.dto.CartDto;
import com.luv2code.doan.entity.Cart;
import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Order;
import com.luv2code.doan.entity.Product;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.paypal.PayPalClient;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.CapturePaymentRequest;
import com.luv2code.doan.request.CheckoutRequest;
import com.luv2code.doan.request.MakePaymentRequest;
import com.luv2code.doan.request.OrderRequest;
import com.luv2code.doan.response.*;
import com.luv2code.doan.service.*;
import com.nimbusds.oauth2.sdk.AccessTokenResponse;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.PaymentExecution;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/paypal")
@Slf4j
public class PaypalRestController {
    @Autowired
    private ExchangeRateService exchangeRateService;

    String CANCEL_URL = "http://localhost:3000/user/order";
    String SUCCESS_URL = "http://localhost:3000/checkout/success";
    private static final double VND_TO_USD_EXCHANGE_RATE = 0.000043; // 1 VND = 0.000043 USD

    @Autowired
    private PaypalService paypalService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ProductService productService;

    @Autowired private OrderService orderService;

    @Autowired
    private OrderStatusService orderStatusService;

    @Autowired
    private CartService cartService;


    @RequestMapping(value = "/payment", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createPayment(@RequestBody CheckoutRequest checkoutRequest, Authentication authentication, HttpServletRequest request) throws PayPalRESTException, NotFoundException, ProductNotFoundException, CartMoreThanProductInStock {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Customer customer = customerService.getCustomerByEmail(userPrincipal.getEmail());


        List<Cart> listCart = new ArrayList<>();
        List<String> listProductIds = new ArrayList<>();

        for(CartDto cartDto : checkoutRequest.getCarts()) {
            Product productInCart = productService.getProductById(cartDto.getProduct().getId());
            log.info("product: " + productInCart.getName());
            log.info("quanitty: " + productInCart.getInStock());

            listCart.add(new Cart(cartDto.getId(), productInCart, customer, cartDto.getQuantity()));
            listProductIds.add(cartDto.getProduct().getId());
        }

        double total = orderService.getTotal(listCart);



        Payment payment = paypalService.createPayment(convertVNDToUSD(total), "USD", "paypal",
                "sale", "test", CANCEL_URL,
                 SUCCESS_URL);

        for(Links link:payment.getLinks()) {
            if(link.getRel().equals("approval_url")) {
                orderService.createOrder(customer, listCart, checkoutRequest.getAddress(), checkoutRequest.getName(), checkoutRequest.getPhone(), payment.getId());
                cartService.deleteCartItemByUser(customer.getId(), listProductIds);

                MakePaymentResponse result = new MakePaymentResponse(1, "Your account has been created successfully!",
                        request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                        link.getHref());

                return new ResponseEntity(result, HttpStatus.OK);
            }

        }
        throw new NotFoundException("Tạo đơn hàng thất bại, hãy thử lại sau!");
    }

    @RequestMapping(value = "/payment/execute", method = RequestMethod.GET)
    public ResponseEntity<?> successPay(HttpServletRequest request, @RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId) throws NotFoundException, OrderStatusNotFoundException {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);

            if (payment.getState().equals("approved")) {
                log.info("success");

                Order order = orderService.findOrderByPaymentId(paymentId);
                orderService.executeOrder(order);


                MakePaymentResponse result = new MakePaymentResponse(1, "Your account has been created successfully!",
                        request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                        "success");

                return new ResponseEntity(result, HttpStatus.OK);
            }
        } catch (PayPalRESTException e) {
            throw new NotFoundException("Thanh toán đơn hàng thất bại, hãy thử lại sau!");
        }
        catch (CartMoreThanProductInStock | OrderStatusNotFoundException ex) {
            throw new NotFoundException(ex.getMessage());
        }



        throw new NotFoundException("Thanh toán đơn hàng thất bại, hãy thử lại sau!");
    }

    private double convertVNDToUSD(double vndAmount) {
        double exchangeRate = exchangeRateService.getUSDSellRate();


        return vndAmount * 1/exchangeRate;
    }

    @RequestMapping(value = "/payment/retry/{id}", method = RequestMethod.PUT )
    public ResponseEntity<?> createPayment(@PathVariable("id") Integer id, Authentication authentication, HttpServletRequest request) throws OrderNotFoundException, PayPalRESTException, NotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Customer customer = customerService.getCustomerByEmail(userPrincipal.getEmail());
        Order order = orderService.getOrder(id, customer);

        Integer orderStatusId = order.getStatus().getId();
        if(orderStatusId != 1) {
            throw new NotFoundException("Đơn hàng đã được thanh toán rồi, không thể thanh toán lại!");
        }
        double total = orderService.getTotalByOrder(order);
        Payment payment = paypalService.createPayment(convertVNDToUSD(total), "USD", "paypal",
                "sale", "test", CANCEL_URL,
                SUCCESS_URL);

        for(Links link:payment.getLinks()) {
            if(link.getRel().equals("approval_url")) {
                order.setPaymentId(payment.getId());
                orderService.saveOrder(order);

                MakePaymentResponse result = new MakePaymentResponse(1, "Your account has been created successfully!",
                        request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                        link.getHref());

                return new ResponseEntity(result, HttpStatus.OK);
            }

        }
        throw new NotFoundException("Cố lỗi xảy ra, hãy thử lại sau!");
    }




}
