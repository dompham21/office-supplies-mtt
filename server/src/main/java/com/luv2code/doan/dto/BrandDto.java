package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Brand;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BrandDto {
    private String id;
    private String name;
    private String image;
    private String description;

    private Date registrationDate;

    private Boolean isActive;

    public BrandDto(Brand brand) {
        this.id = brand.getId();
        this.name = brand.getName();
        this.image = brand.getImage();
        this.description = brand.getDescription();
        this.registrationDate = brand.getRegistrationDate();
        this.isActive = brand.getIsActive();
    }
}
