package com.luv2code.doan.controller;

import com.luv2code.doan.dto.SupplierDto;
import com.luv2code.doan.entity.Supplier;
import com.luv2code.doan.response.ListSupplierResponse;
import com.luv2code.doan.service.SupplierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/supplier")
@RequiredArgsConstructor
@Slf4j
public class SupplierRestController {
    private final SupplierService supplierService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListSupplierResponse> getListSupplier(HttpServletRequest request) {
        List<Supplier> listSupplier = supplierService.getListSupplierActive();
        List<SupplierDto> listSupplierDto = new ArrayList<>();

        for (Supplier s : listSupplier) {
            listSupplierDto.add(new SupplierDto(s));
        }
        ListSupplierResponse result = new ListSupplierResponse(1, "Get all supplier successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listSupplierDto);
        return new ResponseEntity(result, HttpStatus.OK);
    }
}
