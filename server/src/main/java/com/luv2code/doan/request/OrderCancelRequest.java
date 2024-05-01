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
public class OrderCancelRequest {
    @NotNull(message = "Reason cancel must not be null")
    private Integer reasonCancel;
}
