package com.luv2code.doan.response;

import com.luv2code.doan.dto.ProductDto;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductResponse extends BaseResponse {
    private ProductDto data;

    public ProductResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, ProductDto productDto) {
        super(result, msg, method, timestamp, status, code);
        this.data = productDto;
    }


}
