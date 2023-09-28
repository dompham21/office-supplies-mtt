package com.luv2code.doan.request;

import lombok.*;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PromotionDetailRequest {
    @NotNull(message = "Percentage must not be null")
    @Min(value = 0, message = "Percentage should be greater than 0")
    @Max(value = 100, message = "Percentage should be less than 100")
    private Integer percentage;

    @NotNull(message = "Product must not be null!")
    private String productId;
}
