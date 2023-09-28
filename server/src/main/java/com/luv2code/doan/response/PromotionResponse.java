package com.luv2code.doan.response;

import com.luv2code.doan.dto.PromotionDto;
import com.luv2code.doan.entity.Poster;
import com.luv2code.doan.entity.Promotion;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PromotionResponse extends BaseResponse {
    private PromotionDto data;

    public PromotionResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, PromotionDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
