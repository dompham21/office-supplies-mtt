package com.luv2code.doan.controller;

import com.luv2code.doan.dto.OrderDto;
import com.luv2code.doan.dto.ProductDto;
import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.ProductRequest;
import com.luv2code.doan.response.*;
import com.luv2code.doan.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.awt.*;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/product")
@RequiredArgsConstructor
@Slf4j
public class AdminProductRestController {

    @Autowired
    private ProductService productService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private StaffService staffService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @Autowired
    private ImageProductService imageProductService;

    @Autowired
    private PromotionService promotionService;


    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ProductResponse> getProductById(@PathVariable String id, HttpServletRequest request) throws ProductNotFoundException {
        Product product = productService.getProductById(id);
        List<String> listImages = productService.getListImagesStringByProduct(id);
        ProductDto productDto = new ProductDto(product,
                promotionService.getCurrentPromotionByProduct(product),
                priceHistoryService.getPriceFromProductId(product.getId()),
                productService.getSoldQuantity(id),
                listImages);

        ProductResponse result = new ProductResponse(1, "Get product successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), productDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> addProduct(Authentication authentication, @Valid @RequestBody ProductRequest body, HttpServletRequest request) throws BrandNotFoundException, CategoryNotFoundException, IOException, UserNotFoundException, NotFoundException, DuplicateException, ProductNotFoundException, SupplierNotFoundException {

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());

        Product productAfterSave = productService.addProduct(body, staff);

        ProductDto productDto = new ProductDto(productAfterSave,
                promotionService.getCurrentPromotionByProduct(productAfterSave),
                priceHistoryService.getPriceFromProductId(productAfterSave.getId()),
                productService.getSoldQuantity(productAfterSave.getId()),
                productService.getListImagesStringByProduct(productAfterSave.getId()));

        ProductResponse result = new ProductResponse(1, "Add new product successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), productDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> updateProduct(Authentication authentication, @PathVariable String id, @Valid @RequestBody ProductRequest body, HttpServletRequest request) throws BrandNotFoundException, CategoryNotFoundException, ProductNotFoundException, UserNotFoundException, NotFoundException, DuplicateException, SupplierNotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());

        Product productAfterSave = productService.updateProduct(body, staff);



        ProductDto productDto = new ProductDto(productAfterSave,
                promotionService.getCurrentPromotionByProduct(productAfterSave),
                priceHistoryService.getPriceFromProductId(productAfterSave.getId()),
                productService.getSoldQuantity(productAfterSave.getId()),
                productService.getListImagesStringByProduct(productAfterSave.getId()));

        ProductResponse result = new ProductResponse(1, "Update product successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), productDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deleteProduct(@PathVariable String id, HttpServletRequest request) throws ProductNotFoundException {

        productService.deleteProduct(id);

        BaseResponse result = new BaseResponse(1, "Delete product successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/approve/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> approveProduct(@PathVariable String id, HttpServletRequest request) throws ProductNotFoundException {

        productService.approveProduct(id);

        BaseResponse result = new BaseResponse(1, "Approve product successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListProductResponse> findProductsAdmin(
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
            if(sortFieldTemp.trim().equals("name") || sortFieldTemp.trim().equals("id") || sortFieldTemp.trim().equals("soldQuantity") ||
               sortFieldTemp.trim().equals("inStock") || sortFieldTemp.trim().equals("isActive") ||
                    sortFieldTemp.trim().equals("registrationDate")
            ) {
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

        Page page = productService.getListProductsAdmin(pageNo, pageSize, sortField, sortDirection, keyword);
        List<Product> products = page.getContent();
        int totalPage = page.getTotalPages();


        List<ProductDto> listProductsDto = new ArrayList<>();
        for(Product p : products) {
            List<String> listImages = productService.getListImagesStringByProduct(p.getId());
            listProductsDto.add(new ProductDto(
                    p, promotionService.getCurrentPromotionByProduct(p),
                    priceHistoryService.getPriceFromProductId(p.getId()),
                    productService.getSoldQuantity(p.getId()),
                    listImages));
        }

        if(pSortField.isPresent() && pSortField.get().equals("price")) {

            if(sortDirection.equalsIgnoreCase("asc")) {
                listProductsDto = listProductsDto.stream()
                        .sorted(Comparator.comparingDouble(ProductDto::getPrice))
                        .collect(Collectors.toList());
            }
            else {
                listProductsDto = listProductsDto.stream()
                        .sorted(Comparator.comparingDouble(ProductDto::getPrice).reversed())
                        .collect(Collectors.toList());
            }

            totalPage = (listProductsDto.size() + pageSize - 1) / pageSize;
        }

        if(pSortField.isPresent() && pSortField.get().equals("soldQuantity")) {

            if(sortDirection.equalsIgnoreCase("asc")) {
                listProductsDto = listProductsDto.stream()
                        .sorted(Comparator.comparingDouble(ProductDto::getSoldQuantity))
                        .collect(Collectors.toList());
            }
            else {
                listProductsDto = listProductsDto.stream()
                        .sorted(Comparator.comparingDouble(ProductDto::getSoldQuantity).reversed())
                        .collect(Collectors.toList());
            }

            totalPage = (listProductsDto.size() + pageSize - 1) / pageSize;
        }

        if(pSortField.isPresent() && pSortField.get().equals("quantity")) {

            if(sortDirection.equalsIgnoreCase("asc")) {
                listProductsDto = listProductsDto.stream()
                        .sorted(Comparator.comparingDouble(ProductDto::getInStock))
                        .collect(Collectors.toList());
            }
            else {
                listProductsDto = listProductsDto.stream()
                        .sorted(Comparator.comparingDouble(ProductDto::getInStock).reversed())
                        .collect(Collectors.toList());
            }

            totalPage = (listProductsDto.size() + pageSize - 1) / pageSize;
        }

        ListProductResponse result = new ListProductResponse(1, "Get list products successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listProductsDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

}
