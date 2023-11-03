package com.luv2code.doan.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "purchase_order")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrder {
    @Id
    @Column(name = "id", length = 10)
    private String id;

    @Column(name = "created_at", nullable = false)
    @JsonFormat(pattern="dd/MM/yyyy'T'HH:mm:ss.SSS'Z'")
    private Date date;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @OneToMany(mappedBy = "purchaseOrder", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PurchaseOrderDetail> purchaseOrderDetails = new ArrayList<>();
}
