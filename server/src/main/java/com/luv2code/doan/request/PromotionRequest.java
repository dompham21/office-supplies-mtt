package com.luv2code.doan.request;

import com.luv2code.doan.dto.CartDto;
import lombok.*;

import javax.validation.constraints.*;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PromotionRequest {
    @NotBlank(message = "Start Date must not be null!")
    private String startDate;

    @NotBlank(message = "End Date must not be null!")
    private String finishDate;

    @NotNull(message = "Promotion detail must not be null")
    private List<PromotionDetailRequest> promotionDetails;

    @NotBlank(message = "Id must not be blank!")
    @Size(max = 10, message = "Id should be less than 10 characters")
    private String id;

    @NotBlank(message = "Reason must not be blank!")
    @Size(max = 100, message = "Id should be less than 100 characters")
    private String reason;

}
