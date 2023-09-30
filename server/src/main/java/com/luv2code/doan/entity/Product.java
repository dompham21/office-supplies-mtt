package com.luv2code.doan.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "product")
public class Product {
    @Id
    @Column(name = "id", length = 10)
    private String id;

    @Column(name="name", unique = true, length = 50, nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "in_stock", nullable = false)
    private Integer inStock;


    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name="created_at", nullable = false)
    private Date registrationDate;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category categories;

    @ManyToOne
    @JoinColumn(name = "supply_id")
    private Supplier suppliers;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private Collection<Review> reviews;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private Collection<Cart> carts;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<ImageProduct> imageProducts;


    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brands;

}
