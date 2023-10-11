package com.luv2code.doan.request;

import com.luv2code.doan.utils.MessageErrorMap;
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
    @NotBlank(message = MessageErrorMap.NAME_NOT_BLANK)
    @Size(max = 50, message = MessageErrorMap.NAME_MAX_LENGTH)
    private String name;

    @NotBlank(message = MessageErrorMap.GENDER_NOT_BLANK)
    @Size(max = 3, message = MessageErrorMap.GENDER_MAX_LENGTH)
    private String gender;

    @NotBlank(message = MessageErrorMap.BIRTHDAY_NOT_NULL)
    private String birthday;

    @NotBlank(message = MessageErrorMap.ADDRESS_NOT_BLANK)
    private String address;
}
