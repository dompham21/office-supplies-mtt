package com.luv2code.doan.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "invoice")
public class Invoice {
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
    @JoinColumn(name="the_order_id")
    private Order order;

    @Nationalized
    @Column(name="name", nullable = false, length = 50)
    private String name;

    @Column(name="tax_code", nullable = false, length = 13)
    private String taxCode;
}
