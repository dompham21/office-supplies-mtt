package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierDto {

    private String id;

    private String name;

    private String address;

    private String email;

    private String phone;

    private Boolean isActive;

    private String website;

    public SupplierDto (Supplier supplier) {
        this.setId(supplier.getId());
        this.setName(supplier.getName());
        this.setAddress(supplier.getAddress());
        this.setEmail(supplier.getEmail());
        this.setPhone(supplier.getPhone());
        this.setIsActive(supplier.getIsActive());
        this.setWebsite(supplier.getWebsite());
    }
}
