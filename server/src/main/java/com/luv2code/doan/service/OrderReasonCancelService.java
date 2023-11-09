package com.luv2code.doan.service;

import com.luv2code.doan.entity.OrderReasonCancel;
import com.luv2code.doan.entity.OrderStatus;
import com.luv2code.doan.exceptions.OrderStatusNotFoundException;

import java.util.List;


public interface OrderReasonCancelService {

    public List<OrderReasonCancel> listOrderReasonCancel();

    public OrderReasonCancel getOrderReasonCancelById(Integer id) throws OrderStatusNotFoundException;
}
