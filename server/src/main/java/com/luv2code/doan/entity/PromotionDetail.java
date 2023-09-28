package com.luv2code.doan.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luv2code.doan.bean.PromotionDetailKey;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;

@Entity
@Table(name = "promotion_detail")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@IdClass(PromotionDetailKey.class)
public class PromotionDetail implements Serializable {
    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Id
    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @Column(name = "percentage", nullable = false)
    private Integer percentage;
}
