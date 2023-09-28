package com.luv2code.doan.entity;

import com.luv2code.doan.bean.SupplyProductKey;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "supply_product")
@Data
@AllArgsConstructor
@NoArgsConstructor
@IdClass(SupplyProductKey.class)
public class SupplyProduct {

    @Id
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;


}
