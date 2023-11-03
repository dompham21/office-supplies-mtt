package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Promotion;
import com.luv2code.doan.entity.PurchaseOrder;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PurchaseOrderDto {
    private String id;
    private Date date;
    private SupplierDto supplier;
    private StaffDto staff;

    private List<PurchaseOrderDetailDto> purchaseOrderDetails = new ArrayList<>();

    public PurchaseOrderDto(PurchaseOrder purchaseOrder) {
        this.id = purchaseOrder.getId();
        this.date = purchaseOrder.getDate();
        this.supplier = new SupplierDto(purchaseOrder.getSupplier());
        this.staff = new StaffDto(purchaseOrder.getStaff());
    }

    public PurchaseOrderDto(PurchaseOrder purchaseOrder, List<PurchaseOrderDetailDto> purchaseOrderDetails) {
        this.id = purchaseOrder.getId();
        this.date = purchaseOrder.getDate();
        this.supplier = new SupplierDto(purchaseOrder.getSupplier());
        this.staff = new StaffDto(purchaseOrder.getStaff());
        this.purchaseOrderDetails = purchaseOrderDetails;
    }
}
