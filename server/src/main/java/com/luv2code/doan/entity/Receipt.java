package com.luv2code.doan.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "receipt")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Receipt {
    @Id
    @Column(name = "id", length = 10)
    private String id;

    @OneToOne
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    @Column(name = "created_at", nullable = false)
    @JsonFormat(pattern="dd/MM/yyyy'T'HH:mm:ss.SSS'Z'")
    private Date date;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;
}
