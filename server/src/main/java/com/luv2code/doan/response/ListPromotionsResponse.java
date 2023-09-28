package com.luv2code.doan.response;

import com.luv2code.doan.dto.PromotionDto;
import com.luv2code.doan.entity.Poster;
import com.luv2code.doan.entity.Promotion;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListPromotionsResponse extends BaseResponse {
    private List<PromotionDto> data;
    private Integer totalPage;
    private Integer pageNum;

    public ListPromotionsResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<PromotionDto> data, Integer totalPage, Integer pageNum) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNum = pageNum;
    }
}
