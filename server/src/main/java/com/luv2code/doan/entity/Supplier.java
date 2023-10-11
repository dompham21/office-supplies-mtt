package com.luv2code.doan.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.Nationalized;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;

@Entity
@Table(name = "supplier")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Supplier {
    @Id
    @Column(name="id", length = 10)
    private String id;

    @Column(name="name", unique = true, length = 50)
    private String name;

    @Column(name="website", length = 100)
    private String website;

    @Column(name="email", unique = true, length = 64, nullable = false)
    private String email;

    @Column(name="phone", length = 11, nullable = false)
    private String phone;

    @Column(name="address", length = 100, nullable = false)
    private String address;

    @Column(name="created_at", nullable = false)
    private Date registrationDate;

    @Column(name="is_active", nullable = false)
    private Boolean isActive;

    @OneToMany(mappedBy = "suppliers", fetch = FetchType.LAZY)
    private Collection<Product> products;
}
