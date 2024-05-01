package com.luv2code.doan.response;

import com.luv2code.doan.dto.PromotionDto;
import com.luv2code.doan.dto.PurchaseOrderDto;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListPurchaseOrdersResponse extends BaseResponse {
    private List<PurchaseOrderDto> data;
    private Integer totalPage;
    private Integer pageNum;

    public ListPurchaseOrdersResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<PurchaseOrderDto> data, Integer totalPage, Integer pageNum) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNum = pageNum;
    }
}
