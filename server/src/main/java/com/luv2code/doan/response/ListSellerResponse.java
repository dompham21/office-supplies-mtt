package com.luv2code.doan.response;

import com.luv2code.doan.dto.CustomerDto;
import com.luv2code.doan.dto.SellerDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListSellerResponse extends BaseResponse{
    private List<SellerDto> data;
    private Integer totalPage;
    private Integer pageNum;

    public ListSellerResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<SellerDto> data, Integer totalPage, Integer pageNum) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNum = pageNum;
    }
}
