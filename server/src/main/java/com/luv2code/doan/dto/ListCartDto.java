package com.luv2code.doan.dto;

import com.luv2code.doan.response.BaseResponse;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListCartDto extends BaseResponse {
    private List<CartDto> data;

    private double total;


    public ListCartDto(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<CartDto> data, double total) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.total = total;
    }
}
