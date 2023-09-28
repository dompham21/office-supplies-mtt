package com.luv2code.doan.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OtpResponse extends BaseResponse{
    private String email;
    private Integer otp;

    public OtpResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, String email, Integer otp) {
        super(result, msg, method, timestamp, status, code);
        this.email = email;
        this.otp = otp;
    }
}
