package com.luv2code.doan.dto;

import com.luv2code.doan.entity.PurchaseOrder;
import com.luv2code.doan.entity.Receipt;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ReceiptDto {
    private String id;
    private Date date;
    private PurchaseOrderDto purchaseOrder;
    private StaffDto staff;


    public ReceiptDto(Receipt receipt, PurchaseOrderDto purchaseOrder) {
        this.id = receipt.getId();
        this.date = receipt.getDate();
        this.purchaseOrder = purchaseOrder;
        this.staff = new StaffDto(receipt.getStaff());
    }
}
