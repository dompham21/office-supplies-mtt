package com.luv2code.doan.controller;

import com.luv2code.doan.dto.*;
import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.ChangeOrderStatusRequest;
import com.luv2code.doan.request.ShipperRequest;
import com.luv2code.doan.response.*;
import com.luv2code.doan.service.*;
import com.luv2code.doan.utils.MessageErrorMap;
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
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shipper/order")
@RequiredArgsConstructor
@Slf4j
public class ShipperOrderRestController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderStatusService orderStatusService;

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @Autowired
    private ProductService productService;

    @Autowired
    private StaffService staffService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListOrderResponse> findOrdersShipper(
            Authentication authentication,
            @RequestParam(value = "statusIds", required = false) Optional<List<Integer>> pStatusIds,
            @RequestParam(value = "pageNo", required = false) Optional<Integer> pPageNo,
            @RequestParam(value = "pageSize", required = false) Optional<Integer> pPageSize,
            @RequestParam(value = "sortField", required = false) Optional<String> pSortField,
            @RequestParam(value = "sortDirection", required = false) Optional<String> pSortDir,
            @RequestParam(value = "keyword", required = false) Optional<String> pKeyword,
            @RequestParam(value = "fromDate", required = false) Optional<String> pFromDate,
            @RequestParam(value = "toDate", required = false) Optional<String> pToDate,
            HttpServletRequest request) throws OrderStatusNotFoundException, NotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());


        int pageNo = 1;
        int pageSize = 10;
        String sortField = "date";
        String sortDirection = "desc";
        String keyword = null;
        List<Integer> listStatusIds = null;
        Date fromDate = null;
        Date toDate = null;

        if(pStatusIds.isPresent()) {
            for(Integer id : pStatusIds.get()) {
                orderStatusService.getOrderStatusById(id);
            }
            listStatusIds = pStatusIds.get();

        }

        if (pPageNo.isPresent()) {
            pageNo = pPageNo.get();
        }
        if (pPageSize.isPresent()) {
            pageSize = pPageSize.get();
        }
        if (pSortField.isPresent()) {
            String sortFieldTemp = pSortField.get();
            if(sortFieldTemp.trim().equals("date") || sortFieldTemp.trim().equals("id")
                    || sortFieldTemp.trim().equals("name")|| sortFieldTemp.trim().equals("phone")) {
                sortField = sortFieldTemp.trim();
            }
        }
        if (pSortDir.isPresent()) {
            String sortDirTemp = pSortDir.get();
            if(sortDirTemp.trim().equalsIgnoreCase("asc") || sortDirTemp.trim().equalsIgnoreCase("desc")) {
                sortDirection = sortDirTemp.trim();
            }
        }
        if (pKeyword.isPresent()) {
            keyword = pKeyword.get();
        }
        if(pFromDate.isPresent() && !pFromDate.get().trim().isEmpty()) {
            SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
            try {
                fromDate = setToMidnight(format.parse(pFromDate.get()));

            } catch (ParseException e) {
                e.printStackTrace();
                throw new NotFoundException(MessageErrorMap.INVALID_FORMAT_DATETIME);
            }
        }
        if(pToDate.isPresent() && !pToDate.get().trim().isEmpty()) {
            SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
            try {
                toDate = setToLastMinute(format.parse(pToDate.get()));
            } catch (ParseException e) {
                throw new NotFoundException(MessageErrorMap.INVALID_FORMAT_DATETIME);
            }
        }

        Page page = orderService.getListOrdersShipper(staff, pageNo, pageSize, sortField, sortDirection, keyword, fromDate, toDate, listStatusIds);
        List<Order> orders = page.getContent();
        int totalPage = page.getTotalPages();


        List<OrderDto> listOrderDto = new ArrayList<>();
        for(Order order : orders) {
            double total = orderService.getTotalByOrder(order);
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
                                productService.getListImagesStringByProduct(product.getId()))
                        );
                listOrderDetailDto.add(orderDetailDto);
            }
            orderDto.setOrderDetails(listOrderDetailDto);

            listOrderDto.add(orderDto);

        }


        if(pSortField.isPresent() && pSortField.get().equals("totalPrice")) {

            if(sortDirection.equalsIgnoreCase("asc")) {
                listOrderDto = listOrderDto.stream()
                        .sorted(Comparator.comparingDouble(OrderDto::getTotalPrice))
                        .collect(Collectors.toList());
            }
            else {
                listOrderDto = listOrderDto.stream()
                        .sorted(Comparator.comparingDouble(OrderDto::getTotalPrice).reversed())
                        .collect(Collectors.toList());
            }

            totalPage = (listOrderDto.size() + pageSize - 1) / pageSize;
        }

        ListOrderResponse result = new ListOrderResponse(1, "Get list orders successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listOrderDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<OrderResponse> getOrderShipperById(@PathVariable Integer id, HttpServletRequest request) throws OrderNotFoundException {
        Order order = orderService.getOrderById(id);
        double total = orderService.getTotalByOrder(order);
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
                            productService.getListImagesStringByProduct(product.getId()))
                    );
            listOrderDetailDto.add(orderDetailDto);
        }
        orderDto.setOrderDetails(listOrderDetailDto);

        OrderResponse result = new OrderResponse(1, "Get order successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), orderDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/done/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> doneOrderShipper( Authentication authentication, @PathVariable Integer id, HttpServletRequest request) throws OrderNotFoundException, NotFoundException, OrderStatusNotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());

        Order order = orderService.getOrderById(id);

        if(orderService.checkOrderDeliveryByShipper(staff.getId(), order.getId())) {
            order.setStatus(orderStatusService.getOrderStatusById(4));
        }
        else {
            throw new NotFoundException(MessageErrorMap.HAS_NOT_PERMISSION_DONE_ORDER);
        }

        orderService.saveOrder(order);

        BaseResponse result = new BaseResponse(1, "Successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
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
