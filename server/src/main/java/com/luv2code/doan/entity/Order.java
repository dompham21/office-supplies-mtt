package com.luv2code.doan.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;
import java.util.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "order")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name="created_at", nullable = false)
    private Date date;

    @Column(name="address", length = 100, nullable = false)
    private String address;

    @Column(name="payment_id", length = 100)
    private String payment_id;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name="received_at")
    private Date receivedDate;

    @ManyToOne
    @JoinColumn(name="customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name="staff_deliver_id")
    private Staff staffDelivery;

    @ManyToOne
    @JoinColumn(name="seller_id")
    private Seller seller;

    @ManyToOne
    @JoinColumn(name="status_id")
    private OrderStatus status;

    //orphanRemoval mean remove orderDetail when remove order
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();

    @Column(name="name", nullable = false, length = 50)
    private String name;

    @Column(name="phone",nullable = false, length = 11)
    private String phone;
}

