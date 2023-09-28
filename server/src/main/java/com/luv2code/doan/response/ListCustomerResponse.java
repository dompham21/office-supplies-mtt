package com.luv2code.doan.response;

import com.luv2code.doan.dto.CustomerDto;
import com.luv2code.doan.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListCustomerResponse extends BaseResponse{
    private List<CustomerDto> data;
    private Integer totalPage;
    private Integer pageNum;

    public ListCustomerResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<CustomerDto> data, Integer totalPage, Integer pageNum) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNum = pageNum;
    }
}
