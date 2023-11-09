package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.OrderReasonCancel;
import com.luv2code.doan.entity.OrderStatus;
import com.luv2code.doan.exceptions.OrderStatusNotFoundException;
import com.luv2code.doan.repository.OrderReasonCancelRepository;
import com.luv2code.doan.repository.OrderStatusRepository;
import com.luv2code.doan.service.OrderReasonCancelService;
import com.luv2code.doan.service.OrderStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class OrderReasonCancelServiceImpl implements OrderReasonCancelService {

    @Autowired
    private OrderReasonCancelRepository orderReasonCancelRepository;

    public List<OrderReasonCancel> listOrderReasonCancel() {
        return orderReasonCancelRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public OrderReasonCancel getOrderReasonCancelById(Integer id) throws OrderStatusNotFoundException {
        try {
            return orderReasonCancelRepository.findById(id).get();
        }
        catch(NoSuchElementException ex) {
            throw new OrderStatusNotFoundException("Could not find any order status with ID " + id);

        }
    }
}
