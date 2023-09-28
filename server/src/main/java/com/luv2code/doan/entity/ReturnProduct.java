package com.luv2code.doan.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "return_product")
public class ReturnProduct {
    @Id
    @Column(name="id", length = 10)
    private String id;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name="created_at", nullable = false)
    private Date date;

    @ManyToOne
    @JoinColumn(name="staff_id")
    private Staff staff;

    @OneToOne
    @JoinColumn(name="invoice_id")
    private Invoice invoice;

    @OneToMany(mappedBy = "returnProduct", fetch = FetchType.LAZY)
    private Collection<OrderDetail> orderDetails;
}
