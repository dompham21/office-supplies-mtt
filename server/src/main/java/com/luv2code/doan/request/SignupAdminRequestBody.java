package com.luv2code.doan.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupAdminRequestBody {

    @NotBlank(message = "Id must not be blank")
    @Size(max = 10, message = "Id should be less than 10 characters")
    private String id;

    @NotBlank(message = "Name must not be blank")
    @Size(max = 50, message = "Name should be less than 50 characters")
    private String name;

    @NotNull(message = "Role must not be null")
    private Integer roleId;

    @NotBlank(message = "Phone must not be blank")
    @Size(max = 11, message = "Phone should be less than 11 characters")
    private String phone;

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email must be a well-formed email address")
    private String email;

    @NotBlank(message = "Gender must not be blank")
    @Size(max = 4, message = "Gender should be less than 4 characters")
    private String gender;

    @NotBlank(message = "Address must not be blank")
    @Size(max = 100, message = "Address should be less than 100 characters")
    private String address;

    @NotBlank(message = "Avatar must not be blank")
    @Size(max = 100, message = "Avatar should be less than 100 characters")
    private String avatar;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 3 , message = "Password should be greater than equal to 3 characters")
    @Size(max = 50, message = "Password should be less than 100 characters")
    private String password;


    private Boolean isActive = true;

}
