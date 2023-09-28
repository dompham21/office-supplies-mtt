package com.luv2code.doan.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestBody {

    @NotBlank(message = "Name must not be blank")
    @Size(max = 50, message = "Name should be less than 100 characters")
    private String name;

    @NotBlank(message = "Phone must not be blank")
    @Size(max = 11, message = "Phone should be less than 11 characters")
    private String phone;

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email must be a well-formed email address")
    private String email;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 3 , message = "Password should be greater than equal to 3 characters")
    @Size(max = 50, message = "Password should be less than 100 characters")
    private String password;

}
