package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CategoryDto {
    private String id;

    private String name;

    private String image;

    private String description;

    private Date registrationDate;

    private Boolean isActive;

    public CategoryDto(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.image = category.getImage();
        this.description = category.getDescription();
        this.registrationDate = category.getRegistrationDate();
        this.isActive = category.getIsActive();
    }
}
