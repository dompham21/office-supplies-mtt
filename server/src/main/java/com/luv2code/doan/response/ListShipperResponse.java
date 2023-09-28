package com.luv2code.doan.response;

import com.luv2code.doan.dto.ShipperDto;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListShipperResponse extends BaseResponse{
    List<ShipperDto> data;

    public ListShipperResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<ShipperDto> data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
