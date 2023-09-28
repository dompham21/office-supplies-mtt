package com.luv2code.doan.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luv2code.doan.bean.ReceiptDetailKey;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "receipt_detail")
@Data
@AllArgsConstructor
@NoArgsConstructor
@IdClass(ReceiptDetailKey.class)
public class ReceiptDetail {
    @Id
    @ManyToOne
    @JoinColumn(name = "receipt_id")
    private Receipt receipt;

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private Float unitPrice;
}
