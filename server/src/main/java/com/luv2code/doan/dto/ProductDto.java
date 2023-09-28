package com.luv2code.doan.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.luv2code.doan.entity.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ProductDto {
    private String id;

    private String name;

    private String description;

    private Float price;

    private Float priceAfterDiscount;

    private List<String> images;

    private Integer inStock;

    private Integer soldQuantity;

    private Date registrationDate;

    private Boolean isActive;

    private CategoryDto category;

    private BrandDto brand;

    private Float rate;

    private Integer discount;

    public ProductDto(Product product, Integer discount, Float price, Integer soldQuantity, List<String> listImages) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.registrationDate = product.getRegistrationDate();
        this.isActive = product.getIsActive();
        this.category = new CategoryDto(product.getCategories());
        this.brand = new BrandDto(product.getBrands());
        this.inStock = product.getInStock();
        this.price = price;
        this.soldQuantity = soldQuantity;

        if(discount == 0) this.discount = null;
        else this.discount = discount;

        if(price != null && this.discount != null) {
            float discountAmount = (float) (price * (discount / 100.0));
            this.priceAfterDiscount = price - discountAmount;
        }
        else this.priceAfterDiscount = price;

        this.images = listImages;

        this.rate = Float.valueOf(0);
    }

}
