package com.luv2code.doan.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChangePasswordForgotRequest {
    @NotBlank(message = "Please enter a new password in the field!")
    @Size(min = 6, message = "New password should be greater than equal to 6 characters!")
    private String newPassword;

    @NotNull(message = "OTP must not be null!")
    private int otp;


    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email must be a well-formed email address")
    private String email;
}
