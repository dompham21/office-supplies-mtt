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
public class AddressRequest {
    @NotBlank(message = "Name must not be blank")
    @Size(max = 255, message = "Name should be less than 255 characters")
    private String name;

    @NotBlank(message = "Phone must not be blank")
    @Size(max = 11, message = "Phone should be less than 11 characters")
    private String phone;

    @NotBlank(message = "Specific address must not be blank")
    private String specificAddress;

    @NotBlank(message = "Ward code must not be blank")
    private String wardCode;

    private Boolean isDefault;
}
