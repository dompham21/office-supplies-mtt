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
public class PosterRequest {
    @NotBlank(message = "Name must not be blank")
    @Size(max = 20, message = "Name should be less than 20 characters")
    private String name;

    @NotNull(message = "Is active must not be null")
    private Boolean active;

    @NotBlank(message = "Image must not be blank")
    private String image;

    @NotBlank(message = "Id must not be blank")
    @Size(max = 10, message = "Id should be less than 10 characters")
    private String id;

    @NotNull(message = "Type must not be null")
    private Integer type;
}
