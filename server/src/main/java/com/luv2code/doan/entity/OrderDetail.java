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
@Table(name = "the_order_detail")
public class OrderDetail {
    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "quantity_return")
    private Integer quantityReturn;

    @Column(name = "unit_price")
    private Float unitPrice;

    @Id
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "return_id")
    private ReturnProduct returnProduct;
}
