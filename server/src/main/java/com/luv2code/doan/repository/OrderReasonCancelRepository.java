package com.luv2code.doan.repository;

import com.luv2code.doan.entity.OrderReasonCancel;
import com.luv2code.doan.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface OrderReasonCancelRepository extends JpaRepository<OrderReasonCancel, Integer> {
    public OrderReasonCancel getOrderReasonCancelById(int id);
}
