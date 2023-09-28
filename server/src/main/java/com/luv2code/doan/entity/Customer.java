package com.luv2code.doan.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "email", referencedColumnName = "email")
    private Account account;

    @Column(name="address", length = 100, nullable = false)
    private String address;

    @Nationalized
    @Column(name="name", nullable = false, length = 50)
    private String name;

    @Column(name = "avatar", nullable = false, length = 200)
    private String avatar;

    @Column(name="phone", length = 11)
    private String phone;

    @Column(name="gender", length = 3)
    private String gender;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name="birthday", nullable = false)
    private Date birthday;

    @Column(name="created_at", nullable = false)
    private Date registrationDate;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private Collection<Order> orders;

}
