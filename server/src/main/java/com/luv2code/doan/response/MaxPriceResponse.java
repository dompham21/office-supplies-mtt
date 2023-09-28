package com.luv2code.doan.response;

import com.luv2code.doan.dto.BrandDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MaxPriceResponse extends BaseResponse {
    private float data;

    public MaxPriceResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, float data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
