package com.luv2code.doan.service;


import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.CartMoreThanProductInStock;
import com.luv2code.doan.exceptions.OrderNotFoundException;
import com.luv2code.doan.exceptions.OrderStatusNotFoundException;
import org.springframework.data.domain.Page;

import java.util.*;


public interface OrderService {
    public Order findOrderByPaymentId(String paymentId);
    public Order saveOrder(Order order);
    public double getTotal(List<Cart> cartList);
    public double getTotalByOrder(Order order);
    public Order createOrder(Customer customer, List<Cart> cartList, String address, String name, String phone, String paymentId) throws CartMoreThanProductInStock;


    public Order executeOrder(Order order) throws OrderStatusNotFoundException, CartMoreThanProductInStock;

    public void changeOrderStatus(Order order, Integer statusId);

    public Page<Order> getListOrdersAdmin( int pageNo, int pageSize, String sortField, String sortDirection, String keyword, Date fromDate, Date toDate, List<Integer> listStatusIds);
    public Page<Order> getListOrdersShipper(Staff shipper, int pageNo, int pageSize, String sortField, String sortDirection, String keyword, Date fromDate, Date toDate, List<Integer> listStatusIds);

    public Page<Order> listOrderByUser(Customer user, Integer pageNum, Integer pageSize, Date fromDate, Date toDate, String keyword);

    public Order getOrder(Integer id, Customer user) throws OrderNotFoundException;

    public Order getOrderById(Integer id) throws OrderNotFoundException;

    public boolean isUserHasBuyProduct(Integer userId, Integer productId);

    public Order cancelOrder(Order order, OrderReasonCancel orderReasonCancel);
    public boolean checkOrderDeliveryByShipper(String staffId, Integer orderId);

    public Page<Order> getOrderByUserAndStatus(Integer userId, Integer statusId, Integer pageNum, Integer pageSize, Date fromDate, Date toDate);
}
