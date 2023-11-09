package com.luv2code.doan.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.luv2code.doan.dto.*;
import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.AddressRequest;
import com.luv2code.doan.request.ChangeOrderStatusRequest;
import com.luv2code.doan.request.OrderCancelRequest;
import com.luv2code.doan.request.OrderRequest;
import com.luv2code.doan.response.*;
import com.luv2code.doan.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@Slf4j
public class OrderRestController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private StaffService staffService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ProductService productService;


    @Autowired
    private PromotionService promotionService;

    @Autowired
    private OrderStatusService orderStatusService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private OrderReasonCancelService orderReasonCancelService;




    @RequestMapping(value = "/get/{id}", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> getOrdersByUserAndStatus(@PathVariable("id") Integer id,
                                                       @RequestParam(value = "fromDate", required = false) Optional<String> pFromDate,
                                                       @RequestParam(value = "toDate", required = false) Optional<String> pToDate,
                                                       @RequestParam(value = "keyword", required = false) Optional<String> pKeyword,
                                                       @RequestParam(value = "pageNo", required = false) Optional<Integer> pPageNo,
                                                       @RequestParam(value = "pageSize", required = false) Optional<Integer> pPageSize,
                                                       Authentication authentication, HttpServletRequest request) throws UserNotFoundException, OrderStatusNotFoundException, NotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Customer user = customerService.getCustomerByEmail(userPrincipal.getEmail());
        int pageNo = 1;
        int pageSize = 10;
        Date fromDate = null;
        Date toDate = null;
        String keyword = null;

        if (pPageNo.isPresent()) {
            pageNo = pPageNo.get();
        }
        if (pPageSize.isPresent()) {
            pageSize = pPageSize.get();
        }
        if(pKeyword.isPresent()) {
            keyword = pKeyword.get().trim();
        }

        if(pFromDate.isPresent() && !pFromDate.get().trim().isEmpty()) {
            SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
            try {
                fromDate = setToMidnight(format.parse(pFromDate.get()));

            } catch (ParseException e) {
                e.printStackTrace();
                throw new NotFoundException("Lỗi định dạng datetime!");
            }
        }
        if(pToDate.isPresent() && !pToDate.get().trim().isEmpty()) {
            SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
            try {
                toDate = setToLastMinute(format.parse(pToDate.get()));
            } catch (ParseException e) {
                throw new NotFoundException("Lỗi định dạng datetime!");
            }
        }

        int totalPage = 0;


        List<Order> listOrders = new ArrayList<>();
        Page page = null;
        if(id == 0) {
            page = orderService.listOrderByUser(user, pageNo, pageSize, fromDate, toDate, keyword);
        }
        else {
            OrderStatus orderStatus = orderStatusService.getOrderStatusById(id);
            page = orderService.getOrderByUserAndStatus(user.getId(), orderStatus.getId(), pageNo, pageSize, fromDate, toDate);
        }

        listOrders = page.getContent();

        totalPage = page.getTotalPages();


        List<OrderDto> listOrderDto = new ArrayList<>();
        for(Order order : listOrders) {
            double total = orderService.getTotalByOrder(order);
            OrderDto orderDto = new OrderDto(order, total);

            List<OrderDetailDto> listOrderDetailDto = new ArrayList<>();
            List<OrderDetail> listOrderDetail = order.getOrderDetails();

            for(OrderDetail orderDetail : listOrderDetail) {
                Product product = orderDetail.getProduct();
                OrderDetailDto orderDetailDto = new OrderDetailDto(orderDetail,
                        new ProductDto(product, promotionService.getCurrentPromotionByProduct(product),
                                priceHistoryService.getPriceFromProductId(product.getId()),
                                productService.getSoldQuantity(product.getId()),
                                productService.getListImagesStringByProduct(product.getId())));
                listOrderDetailDto.add(orderDetailDto);
            }
            orderDto.setOrderDetails(listOrderDetailDto);

            listOrderDto.add(orderDto);
        }

        ListOrderResponse result = new ListOrderResponse(1, "Get list order successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listOrderDto, totalPage, pageNo
        );
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/detail/{id}", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> getOrderDetailByUserAndOrder(@PathVariable("id") Integer id, Authentication authentication, HttpServletRequest request) throws UserNotFoundException, OrderStatusNotFoundException, OrderNotFoundException, NotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Customer customer = customerService.getCustomerByEmail(userPrincipal.getEmail());


        Order order = orderService.getOrder(id, customer);

        List<OrderDetailDto> orderDetailsDto = new ArrayList<>();

        for(OrderDetail od : order.getOrderDetails()) {
            Review review = reviewService.getReviewByUserIdAndProductId(customer.getId(), od.getProduct().getId());
            Product product = od.getProduct();
            if(review != null) {
                orderDetailsDto.add(new OrderDetailDto(od,
                        new ProductDto(product,
                                promotionService.getCurrentPromotionByProduct(product),
                                priceHistoryService.getPriceFromProductId(product.getId()),
                                productService.getSoldQuantity(product.getId()),
                                productService.getListImagesStringByProduct(product.getId())), true));
            }
            else {
                orderDetailsDto.add(new OrderDetailDto(od,
                        new ProductDto(product,
                                promotionService.getCurrentPromotionByProduct(product),
                                priceHistoryService.getPriceFromProductId(product.getId()),
                                productService.getSoldQuantity(product.getId()),
                                productService.getListImagesStringByProduct(product.getId())), false));
            }

        }
        double total =  orderService.getTotalByOrder(order);

        OrderDto orderDto = new OrderDto(order, total);
        List<OrderDetailDto> listOrderDetailDto = new ArrayList<>();
        List<OrderDetail> listOrderDetail = order.getOrderDetails();

        for(OrderDetail orderDetail : listOrderDetail) {
            Product product = orderDetail.getProduct();
            OrderDetailDto orderDetailDto = new OrderDetailDto(orderDetail,
                    new ProductDto(product,
                            promotionService.getCurrentPromotionByProduct(product),
                            priceHistoryService.getPriceFromProductId(product.getId()),
                            productService.getSoldQuantity(product.getId()),
                            productService.getListImagesStringByProduct(product.getId())));
            listOrderDetailDto.add(orderDetailDto);
        }
        orderDto.setOrderDetails(listOrderDetailDto);


        OrderResponse result = new OrderResponse(1, "Get list order detail successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                orderDto
        );
        return new ResponseEntity(result, HttpStatus.OK);
    }


    @RequestMapping(value = "/request-cancel/{id}", method = RequestMethod.PUT)
    @ResponseBody
    private ResponseEntity<?> requestCancel(@PathVariable("id") Integer id, @RequestBody @Valid OrderCancelRequest orderCancelRequest, Authentication authentication, HttpServletRequest request) throws OrderNotFoundException, NotFoundException, OrderStatusNotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Customer customer = customerService.getCustomerByEmail(userPrincipal.getEmail());
        Order order = orderService.getOrder(id, customer);

        int orderStatusId = order.getStatus().getId();
        if(orderStatusId != 1) {
            throw new NotFoundException("Trạng thái hiện tại của đơn đặt hàng không thể yêu cầu huỷ!");
        }
        OrderReasonCancel orderReasonCancel = orderReasonCancelService.getOrderReasonCancelById(orderCancelRequest.getReasonCancel());

        orderService.cancelOrder(order, orderReasonCancel);

        List<OrderDetailDto> orderDetailsDto = new ArrayList<>();

        for(OrderDetail od : order.getOrderDetails()) {
            Review review = reviewService.getReviewByUserIdAndProductId(customer.getId(), od.getProduct().getId());
            Product product = od.getProduct();
            if(review != null) {
                orderDetailsDto.add(new OrderDetailDto(od,
                        new ProductDto(product,
                                promotionService.getCurrentPromotionByProduct(product),
                                priceHistoryService.getPriceFromProductId(product.getId()),
                                productService.getSoldQuantity(product.getId()),
                                productService.getListImagesStringByProduct(product.getId())), true));
            }
            else {
                orderDetailsDto.add(new OrderDetailDto(od,
                        new ProductDto(product,
                                promotionService.getCurrentPromotionByProduct(product),
                                priceHistoryService.getPriceFromProductId(product.getId()),
                                productService.getSoldQuantity(product.getId()),
                                productService.getListImagesStringByProduct(product.getId())), false));
            }

        }
        double total =  orderService.getTotalByOrder(order);

        OrderDto orderDto = new OrderDto(order, total);
        List<OrderDetailDto> listOrderDetailDto = new ArrayList<>();
        List<OrderDetail> listOrderDetail = order.getOrderDetails();

        for(OrderDetail orderDetail : listOrderDetail) {
            Product product = orderDetail.getProduct();
            OrderDetailDto orderDetailDto = new OrderDetailDto(orderDetail,
                    new ProductDto(product,
                            promotionService.getCurrentPromotionByProduct(product),
                            priceHistoryService.getPriceFromProductId(product.getId()),
                            productService.getSoldQuantity(product.getId()),
                            productService.getListImagesStringByProduct(product.getId())));
            listOrderDetailDto.add(orderDetailDto);
        }
        orderDto.setOrderDetails(listOrderDetailDto);


        OrderResponse result = new OrderResponse(1, "Get list order detail successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                orderDto
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }

    public static Date setToMidnight(Date date) {
        // Create a new Date object with the same date and time set to midnight (00:00)
        return new Date(date.getYear(), date.getMonth(), date.getDate());
    }

    public static Date setToLastMinute(Date date) {
        // Create a new Date object with the same date and time set to 23:59
        return new Date(date.getYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    }
}
