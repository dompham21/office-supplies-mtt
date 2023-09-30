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
    private String reason;
    private String staff;

    private List<PromotionDetailDto> promotionDetails = new ArrayList<>();

    public PromotionDto(Promotion promotion) {
        this.id = promotion.getId();
        this.startDate = promotion.getStartAt();
        this.finishDate = promotion.getEndAt();
        this.reason = promotion.getReason();
        this.staff = promotion.getStaff().getName();
    }

    public PromotionDto(Promotion promotion, List<PromotionDetailDto> promotionDetails) {
        this.id = promotion.getId();
        this.startDate = promotion.getStartAt();
        this.finishDate = promotion.getEndAt();
        this.reason = promotion.getReason();
        this.promotionDetails = promotionDetails;
    }
}
