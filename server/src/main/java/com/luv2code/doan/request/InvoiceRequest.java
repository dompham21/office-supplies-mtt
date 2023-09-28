package com.luv2code.doan.request;

import com.luv2code.doan.dto.CartDto;
import lombok.*;

import javax.validation.constraints.*;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class InvoiceRequest {

    @NotNull(message = "Mã đơn đặt hàng không được để trống")
    private Integer orderId;

    @NotBlank(message = "Vui lòng nhập mã hoá đơn")
    @Size(max = 10, message = "Mã hoá đơn tối đa 10 ký tự")
    private String id;

    @NotBlank(message = "Vui lòng nhập họ và tên")
    @Size(max = 50, message = "Họ và tên tối đa 50 ký tự")
    private String name;

    @NotBlank(message = "Vui lòng nhập mã số thuế")
    @Size(min = 10, message = "Mã số thuế tối thiểu 10 ký tự")
    @Size(max = 13, message = "Mã số thuế tối đa 13 ký tự")
    private String taxCode;
}
