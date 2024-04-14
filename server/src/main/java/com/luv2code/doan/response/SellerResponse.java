package com.luv2code.doan.response;

import com.luv2code.doan.dto.CustomerDto;
import com.luv2code.doan.dto.SellerDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SellerResponse extends BaseResponse {
    private SellerDto data;

    public SellerResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, SellerDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
