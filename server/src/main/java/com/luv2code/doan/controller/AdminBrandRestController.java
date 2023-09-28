package com.luv2code.doan.controller;

import com.luv2code.doan.dto.BrandDto;
import com.luv2code.doan.dto.CategoryDto;
import com.luv2code.doan.entity.Brand;
import com.luv2code.doan.entity.Category;
import com.luv2code.doan.exceptions.BrandNotFoundException;
import com.luv2code.doan.exceptions.CategoryNotFoundException;
import com.luv2code.doan.exceptions.RoleNotFoundException;
import com.luv2code.doan.exceptions.UserNotFoundException;
import com.luv2code.doan.request.BrandRequest;
import com.luv2code.doan.request.CategoryRequest;
import com.luv2code.doan.response.*;
import com.luv2code.doan.service.BrandService;
import com.luv2code.doan.service.CategoryService;
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
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/brand")
@RequiredArgsConstructor
@Slf4j
public class AdminBrandRestController {
    @Autowired
    private BrandService brandService;

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> addBrand(@Valid @RequestBody BrandRequest body, HttpServletRequest request) {


        Brand brand = new Brand();
        brand.setId(body.getId());
        brand.setIsActive(body.getActive());
        brand.setName(body.getName());
        brand.setDescription(body.getDescription());
        brand.setRegistrationDate(new Date());
        brand.setImage(body.getImage());


        Brand brandAfterSave = brandService.saveBrand(brand);

        BrandDto brandDto = new BrandDto(brandAfterSave);

        BrandResponse result = new BrandResponse(1, "Add new brand successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), brandDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> updateBrand(@PathVariable String id, @Valid @RequestBody BrandRequest body, HttpServletRequest request) throws BrandNotFoundException {
        Brand brand = brandService.getBrandById(id);

        brand.setIsActive(body.getActive());
        brand.setName(body.getName());
        brand.setImage(body.getImage());
        brand.setDescription(body.getDescription());
        brand.setRegistrationDate(new Date());

        Brand brandAfterSave = brandService.saveBrand(brand);

        BrandDto brandDto = new BrandDto(brandAfterSave);

        BrandResponse result = new BrandResponse(1, "Update brand successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), brandDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deleteBrand(@PathVariable String id, HttpServletRequest request) throws BrandNotFoundException {

        brandService.deleteBrand(id);

        BaseResponse result = new BaseResponse(1, "Delete brand successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/approve/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> approveBrand(@PathVariable String id, HttpServletRequest request) throws BrandNotFoundException {

        brandService.approveBrand(id);

        BaseResponse result = new BaseResponse(1, "Approve brand successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListBrandResponse> findBrandsAdmin(
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

        Page page = brandService.getListBrandsAdmin(pageNo, pageSize, sortField, sortDirection, keyword);
        List<Brand> brands = page.getContent();
        int totalPage = page.getTotalPages();


        List<BrandDto> listBrandsDto = new ArrayList<>();
        for(Brand c : brands) {
            listBrandsDto.add(new BrandDto(c));
        }

        ListBrandResponse result = new ListBrandResponse(1, "Get list brands successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listBrandsDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<BrandResponse> getBrandById(@PathVariable String id, HttpServletRequest request) throws BrandNotFoundException {
        Brand brand = brandService.getBrandById(id);
        BrandDto brandDto = new BrandDto(brand);

        BrandResponse result = new BrandResponse(1, "Get brand successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), brandDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
