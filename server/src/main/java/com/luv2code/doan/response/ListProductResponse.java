package com.luv2code.doan.response;

import com.luv2code.doan.dto.ProductDto;
import lombok.*;

import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListProductResponse extends BaseResponse {
    private List<ProductDto> data;
    private Integer totalPage;
    private Integer pageNum;

    public ListProductResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<ProductDto> data, Integer totalPage, Integer pageNum) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNum = pageNum;
    }
}
