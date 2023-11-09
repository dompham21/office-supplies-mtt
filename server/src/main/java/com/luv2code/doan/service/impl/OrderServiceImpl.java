package com.luv2code.doan.service.impl;


import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.CartMoreThanProductInStock;
import com.luv2code.doan.exceptions.OrderNotFoundException;
import com.luv2code.doan.exceptions.OrderStatusNotFoundException;
import com.luv2code.doan.repository.OrderDetailRepository;
import com.luv2code.doan.repository.OrderRepository;
import com.luv2code.doan.repository.OrderStatusRepository;
import com.luv2code.doan.repository.ProductRepository;
import com.luv2code.doan.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);
    public static final int ORDERS_PER_PAGE = 5;

    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private CartService cartService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @Autowired
    private OrderStatusService orderStatusService;


    @Transactional
    public Order createOrder(Customer customer, List<Cart> cartList, String address, String name, String phone, String paymentId) throws CartMoreThanProductInStock {
        Order newOrder = new Order();
        newOrder.setAddress(address);
        newOrder.setDate(new Date());
        newOrder.setPaymentId(paymentId);
        newOrder.setCustomer(customer);
        newOrder.setName(name);
        newOrder.setPhone(phone);

        List<OrderDetail> orderDetailSet = newOrder.getOrderDetails();

        for (Cart cart : cartList) {
            Product productCart = cart.getProduct();
            Product product = productRepository.getProductById(productCart.getId());

            if(cart.getQuantity() > product.getInStock()) {
                throw new CartMoreThanProductInStock("Số lượng yêu cầu vượt quá số lượng còn lại của sản phẩm " + product.getName() + "!");
            }

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(newOrder);
            orderDetail.setProduct(product);
            orderDetail.setQuantity(cart.getQuantity());
            int promotionPercentage = promotionService.getCurrentPromotionByProduct(product);
            float price = priceHistoryService.getPriceFromProductId(product.getId());
            if(  promotionPercentage > 0) { //price with discount
                float discountAmount = (float) (price * (promotionPercentage / 100.0));
                float priceAfterDiscount = price - discountAmount;
                orderDetail.setUnitPrice(priceAfterDiscount);
            }
            else orderDetail.setUnitPrice(price);

            orderDetailSet.add(orderDetail);
        }

        newOrder.setStatus(orderStatusRepository.getOrderStatusById(1));
        return orderRepository.save(newOrder);
    }

    @Override
    @Transactional
    public Order executeOrder(Order order) throws OrderStatusNotFoundException, CartMoreThanProductInStock {
        List<OrderDetail> orderDetailSet = order.getOrderDetails();
        for (OrderDetail od : orderDetailSet) {
            Product productCart = od.getProduct();
            Product product = productRepository.getProductById(productCart.getId());
            if(od.getQuantity() > product.getInStock()) {
                throw new CartMoreThanProductInStock("Số lượng yêu cầu vượt quá số lượng còn lại của sản phẩm " + product.getName() + "!");
            }
            product.setInStock(product.getInStock() - od.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(orderStatusService.getOrderStatusById(2));

        return orderRepository.save(order);
    }

    public double getTotal(List<Cart> cartList) {
        double total = 0.0;
        for (Cart cart : cartList) {
            Product product = cart.getProduct();

            Integer promotionPercentage = promotionService.getCurrentPromotionByProduct(product);
            float price = priceHistoryService.getPriceFromProductId(product.getId());
            if(  promotionPercentage > 0) { //price with discount
                float discountAmount = (float) (price * (promotionPercentage / 100.0));
                price = price - discountAmount;
            }

            total += price * cart.getQuantity();
        }
        return total;
    }


    public double getTotalByOrder(Order order) {
        double total = 0.0;
        List<OrderDetail> orderDetailList = orderDetailRepository.getListOrderDetailByOrder(order.getId());
        for(OrderDetail orderDetail : orderDetailList) {
            total += orderDetail.getQuantity() * orderDetail.getUnitPrice();
        }
        return total;
    }
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public void changeOrderStatus(Order order, Integer statusId) {
        if(statusId == 4) { //done
            // will subtract quantity and increase sold quantity
            List<OrderDetail> orderDetail = orderRepository.getOrderDetail(order.getId());

            for(OrderDetail item : orderDetail)
            {
                Product product = item.getProduct();
//                product.setSoldQuantity(product.getSoldQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }
        else if(statusId == 5) { //cancel
            // will increase quantity

            List<OrderDetail> orderDetail = orderRepository.getOrderDetail(order.getId());

            for(OrderDetail item : orderDetail)
            {
                Product product = item.getProduct();
//                product.setInStock(product.getSoldQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }
        order.setStatus(orderStatusRepository.getOrderStatusById(statusId));
        orderRepository.save(order);
    }

    public Page<Order> getListOrdersAdmin(int pageNo, int pageSize, String sortField, String sortDirection, String keyword, Date fromDate, Date toDate, List<Integer> listStatusIds) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);
        boolean hasKeyword = keyword != null && !keyword.isEmpty();
        boolean hasDateRange = fromDate != null && toDate != null;
        if (listStatusIds != null) {
            if (hasKeyword && hasDateRange) {
                return orderRepository.getListOrdersAdminWithKeywordBetweenDateAndStatusId(keyword, listStatusIds, fromDate, toDate, pageable);
            } else if (hasKeyword) {
                return orderRepository.getListOrdersAdminWithKeywordAndStatusId(keyword, listStatusIds, pageable);
            } else if (hasDateRange) {
                return orderRepository.getListOrdersAdminBetweenDateAndStatusId(listStatusIds, fromDate, toDate, pageable);
            } else {
                return orderRepository.getListOrdersAdminWithStatusId(listStatusIds, pageable);
            }
        } else {
            if (hasKeyword && hasDateRange) {
                return orderRepository.getListOrdersAdminWithKeywordBetweenDate(keyword, fromDate, toDate, pageable);
            } else if (hasKeyword) {
                return orderRepository.getListOrdersAdminWithKeyword(keyword, pageable);
            } else if (hasDateRange) {
                return orderRepository.getListOrdersAdminBetweenDate(fromDate, toDate, pageable);
            } else {
                return orderRepository.getListOrdersAdmin(pageable);
            }
        }

    }

    public Page<Order> getListOrdersShipper(Staff staff, int pageNo, int pageSize, String sortField, String sortDirection, String keyword, Date fromDate, Date toDate, List<Integer> listStatusIds) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);
        boolean hasKeyword = keyword != null && !keyword.isEmpty();
        boolean hasDateRange = fromDate != null && toDate != null;
        if (listStatusIds != null) {
            if (hasKeyword && hasDateRange) {
                return orderRepository.getListOrdersShipperWithKeywordBetweenDateAndStatusId(staff.getId(),keyword, listStatusIds, fromDate, toDate, pageable);
            } else if (hasKeyword) {
                return orderRepository.getListOrdersShipperWithKeywordAndStatusId(staff.getId(),keyword, listStatusIds, pageable);
            } else if (hasDateRange) {
                return orderRepository.getListOrdersShipperBetweenDateAndStatusId(staff.getId(),listStatusIds, fromDate, toDate, pageable);
            } else {
                return orderRepository.getListOrdersShipperWithStatusId(staff.getId(),listStatusIds, pageable);
            }
        } else {
            if (hasKeyword && hasDateRange) {
                return orderRepository.getListOrdersShipperWithKeywordBetweenDate(staff.getId(),keyword, fromDate, toDate, pageable);
            } else if (hasKeyword) {
                return orderRepository.getListOrdersShipperWithKeyword(staff.getId(),keyword, pageable);
            } else if (hasDateRange) {
                return orderRepository.getListOrdersShipperBetweenDate(staff.getId(),fromDate, toDate, pageable);
            } else {
                return orderRepository.getListOrdersShipper(staff.getId(),pageable);
            }
        }

    }

    public Page<Order> listOrderByUser(Customer user, Integer pageNum, Integer pageSize, Date fromDate, Date toDate, String keyword) {
        Sort sort = Sort.by("date");
        sort = sort.descending();
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize, sort);
        if(keyword != null) {
            if(fromDate != null && toDate !=  null) {
                return orderRepository.findOrderByUserBetweenDateWithKeyword(user.getId(), fromDate, toDate, keyword, pageable);
            }
            return orderRepository.findOrderByUserWithKeyword(user.getId(), keyword, pageable);
        }
        else {
            if(fromDate != null && toDate !=  null) {
                return orderRepository.findOrderByUserBetweenDate(user.getId(), fromDate, toDate, pageable);
            }
            return orderRepository.findOrderByUser(user.getId(), pageable);
        }

    }

    public Order getOrder(Integer id, Customer user) throws OrderNotFoundException {

        Order order = orderRepository.findByIdAndUser(id, user.getId());
        if(order == null)  throw new OrderNotFoundException("Could not find any order with ID " + id);
        else return order;

    }

    public Order getOrderById(Integer id) throws OrderNotFoundException {
        Order order = orderRepository.findByOrderId(id);
        if(order == null)  throw new OrderNotFoundException("Could not find any order with ID " + id);
        else return order;
    }


    public boolean isUserHasBuyProduct(Integer userId, Integer productId) {
        long num = orderRepository.countOrderByProductAndUser(userId, productId);
        System.out.println("userId: " + userId + ", productId: " + productId + ", num: " + num);
        return num > 0;
    }

    @Override
    @Transactional
    public Order cancelOrder(Order order, OrderReasonCancel orderReasonCancel) {
        List<OrderDetail> orderDetailList = orderDetailRepository.getListOrderDetailByOrder(order.getId());
        for(OrderDetail od: orderDetailList) {
            Product product = od.getProduct();
            product.setInStock(product.getInStock() + od.getQuantity());
            productRepository.save(product);
        }
        order.setReasonCancel(orderReasonCancel);

        order.setStatus(orderStatusRepository.getOrderStatusById(5));

        return orderRepository.save(order);
    }

    @Override
    public boolean checkOrderDeliveryByShipper(String staffId, Integer orderId) {
        // Get the order by id
        Order order = orderRepository.findById(orderId).orElse(null);

        // Check if the order is delivered by the specified shipper
        return order != null && order.getStaffDelivery().getId().equals(staffId);
    }


    public Page<Order> getOrderByUserAndStatus(Integer userId, Integer statusId, Integer pageNum, Integer pageSize, Date fromDate, Date toDate) {
        Sort sort = Sort.by("date");
        sort = sort.descending();
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize, sort);
        if(fromDate != null && toDate !=  null) {
            return orderRepository.getOrderByUserAndStatusBetweenDate(userId, statusId, fromDate, toDate, pageable);
        }
        return orderRepository.getOrderByUserAndStatus(userId, statusId, pageable);
    }

    public Order findOrderByPaymentId(String paymentId) {
        return orderRepository.findOrderByPaymentId(paymentId);
    }
}
