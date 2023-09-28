package com.luv2code.doan.request;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email must be a well-formed email address")
    private String username;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 3 , message = "Password should be greater than equal to 3 characters")
    @Size(max = 100, message = "Password should be less than 100 characters")
    private String password;

}
