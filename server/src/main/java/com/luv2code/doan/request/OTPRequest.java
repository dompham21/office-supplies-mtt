package com.luv2code.doan.request;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class OTPRequest {
    @NotNull(message = "OTP must not be null!")
    private int otp;


}
