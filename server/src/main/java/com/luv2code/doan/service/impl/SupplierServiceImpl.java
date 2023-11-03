package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.Supplier;
import com.luv2code.doan.exceptions.BrandNotFoundException;
import com.luv2code.doan.exceptions.DuplicateException;
import com.luv2code.doan.exceptions.SupplierNotFoundException;
import com.luv2code.doan.repository.SupplierRepository;
import com.luv2code.doan.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class SupplierServiceImpl implements SupplierService {

    public static final int SUPPLIER_PER_PAGE = 9;

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public List<Supplier> getAllSupplier() {
        return supplierRepository.findAll();
    }

    @Override
    public Supplier getSupplierById(String id) throws SupplierNotFoundException{
        return supplierRepository.findById(id).orElseThrow(
                ()-> new SupplierNotFoundException("Could not find any Supplier with ID " + id)
        );
    }

    @Override
    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @Override
    public List<Supplier> getListSupplierActive() {
        return supplierRepository.findByIsActive(true);
    }

    @Override
    public Page<Supplier> getListSupplierAdmin(int pageNo, int pageSize, String sortField, String sortDirection, String keyword) {

        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())?Sort.by(sortField).ascending():Sort.by(sortField).descending();
        Pageable pageable = PageRequest.of(pageNo -1, pageSize, sort);
        if (keyword !=null){
            return supplierRepository.findAllByKeyword(keyword, pageable);
        }
        else {
            return supplierRepository.findAllAdmin(pageable);
        }
    }

    @Override
    public void approveSupplier(String id) throws SupplierNotFoundException {

        Supplier supplier = supplierRepository.findById(id).orElseThrow(
                ()-> new SupplierNotFoundException ("Could not find any supplier with ID " + id)
        );
        supplier.setIsActive(true);
        saveSupplier(supplier);
    }

    public void deleteSupplier(String id) throws SupplierNotFoundException {
//        Supplier supplier = supplierRepository.findById(id).orElseThrow(
//                ()-> new SupplierNotFoundException("Could not find any supplier with ID " + id)
//        );
//        supplier.setIsActive(false);
//        saveSupplier(supplier);
        try {
            Supplier supplier = supplierRepository.findById(id).get();
            supplier.setIsActive(false);
            supplierRepository.save(supplier);
        }
        catch (NoSuchElementException ex){
            throw new SupplierNotFoundException("Could not find any supplier with ID " + id);

        }
    }

    @Override
    public void checkDupplicateIdSupplier(String id) throws DuplicateException {
        Supplier supplier = supplierRepository.findSupplierById(id);
        if(supplier != null)
            throw new DuplicateException("Mã nhà cung cấp đã tồn tại trong hệ thống!");
    }
}
