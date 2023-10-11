package com.luv2code.doan.response;

import com.luv2code.doan.dto.BrandDto;
import com.luv2code.doan.dto.SupplierDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListSupplierResponse extends BaseResponse{
    List<SupplierDto> data;
    private Integer totalPage;
    private Integer pageNum;

    public ListSupplierResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<SupplierDto> data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }

    public ListSupplierResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<SupplierDto> data, Integer totalPage, Integer pageNum) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNum = pageNum;
    }
}
