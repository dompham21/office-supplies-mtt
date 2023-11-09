package com.luv2code.doan.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "the_order_reason_cancel")
public class OrderReasonCancel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Nationalized
    @Column(name = "name", nullable = false, length = 100, unique = true)
    private String name;
}