package com.luv2code.doan.controller;


import com.luv2code.doan.dto.SupplierDto;
import com.luv2code.doan.entity.Supplier;
import com.luv2code.doan.exceptions.SupplierNotFoundException;
import com.luv2code.doan.request.SupplierRequest;
import com.luv2code.doan.response.BaseResponse;
import com.luv2code.doan.response.ListSupplierResponse;
import com.luv2code.doan.response.SupplierResponse;
import com.luv2code.doan.service.SupplierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/supplier")
@RequiredArgsConstructor
@Slf4j
public class AdminSupplierRestController {
    @Autowired
    private SupplierService supplierService;

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> addSupplier(@Valid @RequestBody SupplierRequest body, HttpServletRequest request) {
        Supplier supplier = new Supplier();
        supplier.setId(body.getId());
        supplier.setName(body.getName());
        supplier.setAddress(body.getAddress());
        supplier.setWebsite(body.getWebsite());
        supplier.setPhone(body.getPhone());
        supplier.setEmail(body.getEmail());
        supplier.setIsActive(body.getIsActive());
        supplier.setRegistrationDate(new Date());

        Supplier supplierAfterSave = supplierService.saveSupplier(supplier);

        SupplierDto supplierDto = new SupplierDto(supplierAfterSave);

        SupplierResponse result = new SupplierResponse(1, "Add supplier successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), supplierDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> updateSupplier(@PathVariable String id, @Valid @RequestBody SupplierRequest body, HttpServletRequest request) throws SupplierNotFoundException {
        Supplier supplier = supplierService.getSupplierById(id);
        supplier.setIsActive(body.getIsActive());
        supplier.setName(body.getName());
        supplier.setPhone(body.getPhone());
        supplier.setEmail(body.getEmail());
        supplier.setWebsite(body.getWebsite());
        supplier.setRegistrationDate(new Date());

        Supplier supplierAfterSave = supplierService.saveSupplier(supplier);
        SupplierDto supplierDto = new SupplierDto(supplierAfterSave);
        SupplierResponse result = new SupplierResponse(1, "Update supplier successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), supplierDto);
        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deleteSupplier(@PathVariable String id, HttpServletRequest request) throws SupplierNotFoundException {
        supplierService.deleteSupplier(id);

        BaseResponse result = new BaseResponse(1, "Delete supplier successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/approve/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> approveSupplier(@PathVariable String id, HttpServletRequest request) throws SupplierNotFoundException {
        supplierService.approveSupplier(id);
        BaseResponse result = new BaseResponse(1, "Approve supplier successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListSupplierResponse> findSupplierAdmin (
            @RequestParam(value = "pageNo", required = false) Optional<Integer> pPageNo,
            @RequestParam(value = "pageSize", required = false) Optional<Integer> pPageSize,
            @RequestParam(value = "sortField", required = false) Optional<String> pSortField,
            @RequestParam(value = "sortDirection", required = false) Optional<String> pSortDir,
            @RequestParam(value = "keyword", required = false) Optional<String> pKeyword,
            HttpServletRequest request) {
        int pageNo = 1;
        int pageSize = 10;
        String sortField = "id";
        String sortDirection = "ASC";
        String keyword = null;

        if (pPageNo.isPresent()) {
            pageNo = pPageNo.get();
        }
        if (pPageSize.isPresent()) {
            pageSize = pPageSize.get();
        }
        if (pSortField.isPresent()) {
            String sortFieldTemp = pSortField.get();
            if(sortFieldTemp.trim().equals("name") || sortFieldTemp.trim().equals("id") ||
                    sortFieldTemp.trim().equals("isActive") ||
                    sortFieldTemp.trim().equals("registrationDate")) {
                sortField = sortFieldTemp.trim();
            }
        }
        if (pSortDir.isPresent()) {
            String sortDirTemp = pSortDir.get();
            if(sortDirTemp.trim().equals("asc") || sortDirTemp.trim().equals("desc") ||
                    sortDirTemp.trim().equals("ASC") || sortDirTemp.trim().equals("DESC")) {
                sortDirection = sortDirTemp.trim();
            }
        }
        if (pKeyword.isPresent()) {
            keyword = pKeyword.get();
        }
        Page page = supplierService.getListSupplierAdmin(pageNo, pageSize, sortField, sortDirection, keyword);
        List<Supplier> suppliers = page.getContent();
        int totalPage = page.getTotalPages();


        List<SupplierDto> supplierDto = new ArrayList<>();
        for(Supplier s : suppliers) {
            supplierDto.add(new SupplierDto(s));
        }

        ListSupplierResponse result = new ListSupplierResponse(1, "Get list brands successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                supplierDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<SupplierResponse> getSupplierById(@PathVariable String id, HttpServletRequest request) throws SupplierNotFoundException {
        Supplier supplier = supplierService.getSupplierById(id);
        SupplierDto supplierDto = new SupplierDto(supplier);

        SupplierResponse result = new SupplierResponse(1, "Get supplier successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), supplierDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
