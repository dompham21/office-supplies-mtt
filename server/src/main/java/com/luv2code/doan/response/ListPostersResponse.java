package com.luv2code.doan.response;

import com.luv2code.doan.dto.PosterDto;
import com.luv2code.doan.entity.Poster;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListPostersResponse extends BaseResponse {
    private List<PosterDto> data;
    private Integer totalPage;
    private Integer pageNum;

    public ListPostersResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<PosterDto> data, Integer totalPage, Integer pageNum) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNum = pageNum;
    }
}
