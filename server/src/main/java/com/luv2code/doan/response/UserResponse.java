package com.luv2code.doan.response;

import com.luv2code.doan.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserResponse extends BaseResponse {
    private UserDto data;

    public UserResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, UserDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
