package com.luv2code.doan.request;

import com.luv2code.doan.utils.MessageErrorMap;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestBody {

    @NotBlank(message = MessageErrorMap.NAME_NOT_BLANK)
    @Size(max = 50, message = MessageErrorMap.NAME_MAX_LENGTH)
    private String name;

    @NotBlank(message = MessageErrorMap.PHONE_NOT_BLANK)
    @Size(max = 11, message = MessageErrorMap.PHONE_MAX_LENGTH)
    private String phone;

    @NotBlank(message = MessageErrorMap.EMAIL_NOT_BLANK)
    @Size(max = 64, message =MessageErrorMap.EMAIL_MAX_LENGTH)
    @Email(message = MessageErrorMap.EMAIL_INVALID_FORMAT)
    private String email;

    @NotBlank(message = MessageErrorMap.PASSWORD_NOT_BLANK)
    @Size(min = 3 , message = MessageErrorMap.PASSWORD_MIN_LENGTH)
    @Size(max = 100, message = MessageErrorMap.PASSWORD_MAX_LENGTH)
    private String password;

}
