package com.luv2code.doan.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luv2code.doan.bean.PurchaseOrderDetailKey;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "purchase_order_detail")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@IdClass(PurchaseOrderDetailKey.class)
public class PurchaseOrderDetail {
    @Id
    @ManyToOne
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private Float unitPrice;
}
