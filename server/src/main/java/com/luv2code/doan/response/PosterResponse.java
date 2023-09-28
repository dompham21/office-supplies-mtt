package com.luv2code.doan.response;

import com.luv2code.doan.dto.BrandDto;
import com.luv2code.doan.dto.PosterDto;
import com.luv2code.doan.entity.Poster;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PosterResponse extends BaseResponse {
    private PosterDto data;

    public PosterResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, PosterDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
