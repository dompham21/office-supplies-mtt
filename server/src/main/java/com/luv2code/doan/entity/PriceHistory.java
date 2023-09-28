package com.luv2code.doan.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luv2code.doan.bean.PriceHistoryKey;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "price_history")
@IdClass(PriceHistoryKey.class)
public class PriceHistory {

    @Id
    @ManyToOne
    @JoinColumn(name="staff_id")
    private Staff staff;

    @Id
    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product;

    @Id
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name="apply_at", nullable = false)
    private Date applyDate;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name="created_at", nullable = false)
    private Date createDate;

    @Column(name = "price", nullable = false)
    private Float price;

}
