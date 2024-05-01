package com.luv2code.doan.service;

import com.luv2code.doan.entity.Supplier;
import com.luv2code.doan.exceptions.DuplicateException;
import com.luv2code.doan.exceptions.SupplierNotFoundException;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SupplierService {
    public List<Supplier> getAllSupplier();

    public Supplier getSupplierById(String id) throws SupplierNotFoundException;

    public Supplier saveSupplier(Supplier supplier);

    public List<Supplier> getListSupplierActive();

    public Page<Supplier> getListSupplierAdmin( int pageNo, int pageSize, String sortField, String sortDirection, String keyword);

    public void approveSupplier (String id) throws SupplierNotFoundException;

    public void deleteSupplier (String id) throws SupplierNotFoundException;

    public void checkDupplicateIdSupplier(String id) throws DuplicateException;
}
