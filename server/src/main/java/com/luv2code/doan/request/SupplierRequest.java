package com.luv2code.doan.request;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierRequest {
    @NotBlank(message = "Id must not be blank")
    @Size(max = 10, message = "Id should be less than 10 characters" )
    private String id;

    @NotBlank(message = "Name must not be blank")
    @Size(max = 50, message = "Name should be less than 50 characters")
    private String name;

    @NotBlank(message = "Address must not be blank")
    @Size(max = 100, message = "Address should be less than 100 characters")
    private String address;

    @NotBlank(message = "Email must not be blank")
    @Size(max = 64, message = "Email should be less than 64 characters")
    private String email;

    @NotBlank(message = "Phone must not be blank")
    @Size(max = 11, message = "Phone should be less than 11 characters")
    private String phone;

    @NotNull(message = "Is active must not be null")
    private Boolean isActive;

    @Size(max = 100, message = "Website should be less than 64 characters")
    private String website;


}
