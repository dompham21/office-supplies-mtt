package com.luv2code.doan.request;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserRequest {
    @NotBlank(message = "Name must not be blank")
    @Size(max = 50, message = "Name should be less than 100 characters")
    private String name;

    @NotBlank(message = "Phone must not be blank")
    @Size(max = 11, message = "Phone should be less than 11 characters")
    private String phone;

    @NotBlank(message = "Email must not be blank")
    @Size(max = 64, message = "Name should be less than 100 characters")
    @Email(message = "Email must be a well-formed email address")
    private String email;

    @NotNull(message = "Is active must not be null")
    private Boolean active;

    @NotBlank(message = "Image must not be blank")
    private String avatar;

    @NotNull(message = "Roles must not be null")
    private List<Integer> roles;

}
