package com.luv2code.doan.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "poster")
public class Poster {
    @Id
    @Column(name = "id", length = 10)
    private String id;

    @Column(name = "image", length = 100, nullable = false)
    private String image;

    @Nationalized
    @Column(name = "name", length = 20, nullable = false, unique = true)
    private String name;

    @Column(name = "type",nullable = false)
    private Integer type;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;
}
