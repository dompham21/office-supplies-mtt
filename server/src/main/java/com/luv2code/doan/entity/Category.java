package com.luv2code.doan.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "category")
public class Category {
    @Id
    @Column(name = "id", length = 10)
    private String id;

    @Nationalized
    @Column(name = "name", length = 50, nullable = false, unique = true)
    private String name;

    @Column(name = "image", length = 100, nullable = false)
    private String image;

    @Nationalized
    @Column(name = "description", length = 100, nullable = false)
    private String description;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name="created_at", nullable = false)
    private Date registrationDate;

    @Column(name="is_active", nullable = false)
    private Boolean isActive;

    @OneToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    private Collection<Product> products;
}
