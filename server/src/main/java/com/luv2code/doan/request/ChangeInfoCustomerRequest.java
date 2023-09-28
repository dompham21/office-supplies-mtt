package com.luv2code.doan.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChangeInfoCustomerRequest {
    @NotBlank(message = "Name must not be blank")
    @Size(max = 50, message = "Name should be less than 50 characters")
    private String name;

    @NotBlank(message = "Gender must not be blank")
    @Size(max = 3, message = "Gender should be less than 3 characters")
    private String gender;

    @NotBlank(message = "Birthday must not be null")
    private String birthday;

    @NotBlank(message = "Address must not be null")
    @Size(max = 100, message = "Address should be less than 100 characters")
    private String address;
}
