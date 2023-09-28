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
@Table(name="staff")
public class Staff {
    @Id
    @Column(name="id", length = 10)
    private String id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "email", referencedColumnName = "email")
    private Account account;

    @Nationalized
    @Column(name="name", nullable = false, length = 50)
    private String name;

    @Column(name = "avatar", nullable = false, length = 100)
    private String avatar;

    @Column(name="phone", length = 13, nullable = false)
    private String phone;

    @Column(name="gender", length = 4, nullable = false)
    private String gender;

    @Nationalized
    @Column(name="address", length = 100, nullable = false)
    private String address;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name="created_at", nullable = false)
    private Date registrationDate;

    @OneToMany(mappedBy = "staffDelivery", fetch = FetchType.LAZY)
    private Collection<Order> ordersDelivery;

    @OneToMany(mappedBy = "staffApprove", fetch = FetchType.LAZY)
    private Collection<Order> ordersApprove;
}
