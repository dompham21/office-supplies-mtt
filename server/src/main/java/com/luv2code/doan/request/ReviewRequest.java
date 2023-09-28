package com.luv2code.doan.request;

import com.luv2code.doan.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewRequest {
    @NotNull(message = "Product id must not be null")
    private Integer productId;

    @NotNull(message = "Vote must not be null")
    @Min(value = 0, message = "Vote should be greater than equal 0")
    @Max(value = 5, message = "Vote should be less than equal 5")
    private Integer vote;

    @NotBlank(message = "Comment must not be blank")
    private String comment;
}
