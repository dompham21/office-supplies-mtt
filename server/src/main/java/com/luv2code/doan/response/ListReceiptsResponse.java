package com.luv2code.doan.response;

import com.luv2code.doan.dto.PurchaseOrderDto;
import com.luv2code.doan.dto.ReceiptDto;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListReceiptsResponse extends BaseResponse {
    private List<ReceiptDto> data;
    private Integer totalPage;
    private Integer pageNum;

    public ListReceiptsResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<ReceiptDto> data, Integer totalPage, Integer pageNum) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNum = pageNum;
    }
}
