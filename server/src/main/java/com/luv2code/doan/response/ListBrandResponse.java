package com.luv2code.doan.response;

import com.luv2code.doan.dto.BrandDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListBrandResponse extends BaseResponse{
    List<BrandDto> data;
    private Integer totalPage;
    private Integer pageNum;

    public ListBrandResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<BrandDto> data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }

    public ListBrandResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<BrandDto> data, Integer totalPage, Integer pageNum) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNum = pageNum;
    }
}
