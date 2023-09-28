package com.luv2code.doan.controller;

import com.luv2code.doan.dto.CustomerDto;
import com.luv2code.doan.dto.InvoiceDto;
import com.luv2code.doan.dto.OrderDetailDto;
import com.luv2code.doan.dto.ProductDto;
import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.InvoiceRequest;
import com.luv2code.doan.request.ProductRequest;
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
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/invoice")
@RequiredArgsConstructor
@Slf4j
public class AdminInvoiceRestController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private StaffService staffService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @Autowired
    private ProductService productService;

    @Autowired
    private PromotionService promotionService;



    @RequestMapping(value = "/get/{orderId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getInvoiceByOrderId(@PathVariable Integer orderId, HttpServletRequest request) throws OrderNotFoundException {
        Order order = orderService.getOrderById(orderId);
        Invoice invoice = invoiceService.getInvoiceByOrder(order);

        if(invoice == null) {
            InvoiceResponse result = new InvoiceResponse(1, "Get invoice successfully!", request.getMethod(), new Date().getTime(),
                    HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), null);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }

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

        InvoiceDto invoiceDto = new InvoiceDto(invoice, orderService.getTotalByOrder(order), listOrderDetailDto);


        InvoiceResponse result = new InvoiceResponse(1, "Get invoice successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), invoiceDto);
        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> addInvoice(Authentication authentication, @Valid @RequestBody InvoiceRequest body, HttpServletRequest request) throws BrandNotFoundException, CategoryNotFoundException, IOException, UserNotFoundException, NotFoundException, DuplicateException, OrderNotFoundException {

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());
        if(invoiceService.existsInvoiceById(body.getId().trim().toUpperCase())) {
            throw new DuplicateException("Mã hoá đơn không được trùng!");
        }

        Order order = orderService.getOrderById(body.getOrderId());
        Invoice existInvoice = invoiceService.getInvoiceByOrder(order);

        if(existInvoice != null) {
            throw new DuplicateException("Đơn hàng này đã có hoá đơn, không thể tạo thêm!");
        }
        Invoice invoice = new Invoice();
        invoice.setName(body.getName().trim());
        invoice.setDate(new Date());
        invoice.setStaff(staff);
        invoice.setId(body.getId().trim().toUpperCase());
        invoice.setTaxCode(body.getTaxCode().trim().toUpperCase());
        invoice.setOrder(order);

        invoiceService.saveInvoice(invoice);


        BaseResponse result = new BaseResponse(1, "Add new invoice successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
