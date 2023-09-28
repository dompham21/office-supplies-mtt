package com.luv2code.doan.response;

import com.luv2code.doan.dto.ReviewDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListReviewResponse extends BaseResponse {
    private List<ReviewDto> data;

    private Integer totalPage;

    private Integer pageNum;

    public ListReviewResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<ReviewDto> data, Integer totalPage, Integer pageNum) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNum = pageNum;
    }
}
