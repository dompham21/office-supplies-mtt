package com.luv2code.doan.response;

import com.luv2code.doan.dto.UserDto;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SignupResponse extends BaseResponse {
    private UserDto data;
    private String accessToken;
    private String refreshToken;


    public SignupResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, UserDto data, String accessToken, String refreshToken) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}

