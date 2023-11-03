package com.luv2code.doan.request;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ReceiptRequest {

    @NotBlank(message = "Id must not be blank!")
    @Size(max = 10, message = "Id should be less than 10 characters")
    private String id;

    @NotBlank(message = "Purchase Order must not be blank!")
    private String purchaseOrder;
}
