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
public class ChangeNameRequest {
    @NotBlank(message = "Name must not be blank")
    @Size(max = 100, message = "Name should be less than 100 characters")
    private String name;
}
