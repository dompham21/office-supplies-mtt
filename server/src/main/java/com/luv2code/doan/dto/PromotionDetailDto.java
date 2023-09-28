package com.luv2code.doan.dto;

import com.luv2code.doan.entity.PromotionDetail;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PromotionDetailDto {
    private Integer percentage;
    private ProductDto product;

    public PromotionDetailDto(PromotionDetail promotionDetail, ProductDto product) {
        this.percentage = promotionDetail.getPercentage();
        this.product = product;
    }
}
