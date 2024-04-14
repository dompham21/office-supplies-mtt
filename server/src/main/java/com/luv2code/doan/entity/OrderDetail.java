package com.luv2code.doan.entity;


import com.luv2code.doan.bean.OrderDetailKey;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@IdClass(OrderDetailKey.class)
@Table(name = "order_detail")
public class OrderDetail {
    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "unit_price")
    private Float unitPrice;

    @Id
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Id
    @ManyToOne
    @JoinColumn(name = "variant_id")
    private ProductVariant product;
}
