package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Order;
import com.luv2code.doan.entity.OrderStatus;
import lombok.*;

import java.util.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class OrderDto {
    private Integer id;
    private Date date;
    private double totalPrice;
    private OrderStatus status;
    private List<OrderDetailDto> orderDetails = new ArrayList<>();
    private String name;
    private String phone;
    private String address;
    private UserDto customer;
    private UserDto staffDelivery;
    private UserDto staffApprove;


    public OrderDto(Order order, double total) {
        this.id = order.getId();
        this.date = order.getDate();
        this.status = order.getStatus();
        this.name = order.getName();
        this.phone = order.getPhone();
        this.address = order.getAddress();
        this.totalPrice = total;
        if(order.getStaffApprove() != null && order.getStaffDelivery() != null) {
            this.staffDelivery = new UserDto(order.getStaffDelivery());
            this.staffApprove = new UserDto(order.getStaffApprove());
        }
        this.customer = new UserDto(order.getCustomer());
    }

    public OrderDto(Order order, double total, List<OrderDetailDto> orderDetailDtoList) {
        this.id = order.getId();
        this.date = order.getDate();
        this.status = order.getStatus();
        this.name = order.getName();
        this.orderDetails = orderDetailDtoList;
        this.phone = order.getPhone();
        this.address = order.getAddress();
        this.totalPrice = total;
        if(order.getStaffApprove() != null && order.getStaffDelivery() != null) {
            this.staffDelivery = new UserDto(order.getStaffDelivery());
            this.staffApprove = new UserDto(order.getStaffApprove());
        }
        this.customer = new UserDto(order.getCustomer());
    }
}
