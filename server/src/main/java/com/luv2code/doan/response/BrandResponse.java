package com.luv2code.doan.response;

import com.luv2code.doan.dto.BrandDto;
import com.luv2code.doan.dto.CategoryDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BrandResponse extends BaseResponse {
    private BrandDto data;

    public BrandResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, BrandDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
