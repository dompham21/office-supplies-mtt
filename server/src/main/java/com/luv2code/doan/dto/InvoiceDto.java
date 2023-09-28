package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Invoice;
import com.luv2code.doan.entity.Order;
import lombok.*;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class InvoiceDto {
    private String id;
    private Date date;
    private OrderDto order;
    private String name;
    private String taxCode;
    private StaffDto staff;

    public InvoiceDto(Invoice invoice, double total, List<OrderDetailDto> orderDetailDtoList) {
        this.id = invoice.getId();
        this.date = invoice.getDate();
        this.name = invoice.getName();
        this.taxCode = invoice.getTaxCode();
        this.order = new OrderDto(invoice.getOrder(), total, orderDetailDtoList);
        this.staff = new StaffDto(invoice.getStaff());
    }
}
