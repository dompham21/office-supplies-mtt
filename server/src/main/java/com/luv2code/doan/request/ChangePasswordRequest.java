package com.luv2code.doan.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChangePasswordRequest {
    @NotBlank(message = "Please enter a old password in the field!")
    @Size(min = 3 , message = "Old password should be greater than equal to 3 characters")
    @Size(max = 50, message = "Old password should be less than 100 characters")
    private String oldPassword;

    @NotBlank(message = "Please enter a new password in the field!")
    @Size(min = 3 , message = "New password should be greater than equal to 3 characters")
    @Size(max = 50, message = "New password should be less than 100 characters")
    private String newPassword;

    @NotBlank(message = "Please enter a confirm password in the field!")
    @Size(min = 3 , message = "Confirm password should be greater than equal to 3 characters")
    @Size(max = 50, message = "Confirm password should be less than 100 characters")
    private String confirmPassword;
}
