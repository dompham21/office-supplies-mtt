package com.luv2code.doan.response;

import com.luv2code.doan.dto.CategoryDto;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListCategoryResponse extends BaseResponse {
    private List<CategoryDto> data;
    private Integer totalPage;
    private Integer pageNum;


    public ListCategoryResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<CategoryDto> data, Integer totalPage, Integer pageNum) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNum = pageNum;
    }
}
