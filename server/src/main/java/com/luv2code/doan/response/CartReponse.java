package com.luv2code.doan.response;

import com.luv2code.doan.dto.CartDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CartReponse extends BaseResponse {
    private CartDto data;

    public CartReponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, CartDto cartDto) {
        super(result, msg, method, timestamp, status, code);
        this.data = cartDto;
    }
}
