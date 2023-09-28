package com.luv2code.doan.dto;

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
public class PromotionDto {
    private String id;
    private Date startDate;
    private Date finishDate;
    private Boolean active;

    private List<PromotionDetailDto> promotionDetails = new ArrayList<>();

    public PromotionDto(Promotion promotion) {
        this.id = promotion.getId();
    }

    public PromotionDto(Promotion promotion, List<PromotionDetailDto> promotionDetails) {
        this.id = promotion.getId();


        this.promotionDetails = promotionDetails;
    }
}
