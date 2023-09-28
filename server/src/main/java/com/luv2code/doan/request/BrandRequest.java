package com.luv2code.doan.request;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BrandRequest {
    @NotBlank(message = "Id must not be blank")
    @Size(max = 10, message = "Name should be less than 10 characters")
    private String id;

    @NotBlank(message = "Name must not be blank")
    @Size(max = 100, message = "Name should be less than 100 characters")
    private String name;

    @NotNull(message = "Is active must not be null")
    private Boolean active;

    @NotBlank(message = "Image must not be blank")
    private String image;

    @NotBlank(message = "Description must not be blank")
    private String description;
}
