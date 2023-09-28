package com.luv2code.doan.entity;

import lombok.*;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="account")
public class Account {
    @Id
    @Column(name="email", unique = true, length = 64)
    private String email;

    @Column(name="password", nullable = false, length = 100)
    private String password;

    @Column(name="is_active", nullable = false)
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
}
