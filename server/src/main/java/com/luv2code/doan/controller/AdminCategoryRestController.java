package com.luv2code.doan.controller;

import com.luv2code.doan.dto.CategoryDto;
import com.luv2code.doan.dto.ProductDto;
import com.luv2code.doan.dto.UserDto;
import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.BrandNotFoundException;
import com.luv2code.doan.exceptions.CategoryNotFoundException;
import com.luv2code.doan.exceptions.RoleNotFoundException;
import com.luv2code.doan.exceptions.UserNotFoundException;
import com.luv2code.doan.request.CategoryRequest;
import com.luv2code.doan.request.ProductRequest;
import com.luv2code.doan.request.UserRequest;
import com.luv2code.doan.response.*;
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
@RequestMapping("/api/admin/category")
@RequiredArgsConstructor
@Slf4j
public class AdminCategoryRestController {
    @Autowired
    private CategoryService categoryService;

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> addCategory(@Valid @RequestBody CategoryRequest body, HttpServletRequest request) throws CategoryNotFoundException, IOException {


        Category category = new Category();
        category.setId(body.getId());
        category.setIsActive(body.getActive());
        category.setName(body.getName());
        category.setDescription(body.getDescription());
        category.setRegistrationDate(new Date());
        category.setImage(body.getImage());


        Category categoryAfterSave = categoryService.saveCategory(category);

        CategoryDto categoryDto = new CategoryDto(categoryAfterSave);

        CategoryResponse result = new CategoryResponse(1, "Add new category successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), categoryDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> updateCategory(@PathVariable String id, @Valid @RequestBody CategoryRequest body, HttpServletRequest request) throws UserNotFoundException, RoleNotFoundException, CategoryNotFoundException {
        Category category = categoryService.getCategoryById(id);

        category.setIsActive(body.getActive());
        category.setName(body.getName());
        category.setImage(body.getImage());
        category.setDescription(body.getDescription());
        category.setRegistrationDate(new Date());

        Category categoryAfterSave = categoryService.saveCategory(category);

        CategoryDto categoryDto = new CategoryDto(categoryAfterSave);

        CategoryResponse result = new CategoryResponse(1, "Update category successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), categoryDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deleteCategory(@PathVariable String id, HttpServletRequest request) throws CategoryNotFoundException {

        categoryService.deleteCategory(id);

        BaseResponse result = new BaseResponse(1, "Delete category successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/approve/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> approveCategory(@PathVariable String id, HttpServletRequest request) throws UserNotFoundException, CategoryNotFoundException {

        categoryService.approveCategory(id);

        BaseResponse result = new BaseResponse(1, "Approve category successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListCategoryResponse> findCategoriesAdmin(
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

        Page page = categoryService.getListCategoriesAdmin(pageNo, pageSize, sortField, sortDirection, keyword);
        List<Category> categories = page.getContent();
        int totalPage = page.getTotalPages();


        List<CategoryDto> listCategoriesDto = new ArrayList<>();
        for(Category c : categories) {
            listCategoriesDto.add(new CategoryDto(c));
        }

        ListCategoryResponse result = new ListCategoryResponse(1, "Get list categories successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listCategoriesDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable String id, HttpServletRequest request) throws CategoryNotFoundException {
        Category category = categoryService.getCategoryById(id);
        CategoryDto categoryDto = new CategoryDto(category);

        CategoryResponse result = new CategoryResponse(1, "Get category successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), categoryDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
