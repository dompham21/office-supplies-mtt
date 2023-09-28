package com.luv2code.doan.response;

import com.luv2code.doan.dto.CustomerDto;
import com.luv2code.doan.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CustomerResponse extends BaseResponse {
    private CustomerDto data;

    public CustomerResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, CustomerDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
