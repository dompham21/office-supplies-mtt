package com.luv2code.doan.controller;

import com.luv2code.doan.dto.ProductDto;
import com.luv2code.doan.dto.PromotionDetailDto;
import com.luv2code.doan.dto.PromotionDto;
import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.PromotionDetailRequest;
import com.luv2code.doan.request.PromotionRequest;
import com.luv2code.doan.response.*;
import com.luv2code.doan.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/admin/promotion")
@RequiredArgsConstructor
@Slf4j
public class AdminPromotionRestController {

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private StaffService staffService;

    @Autowired
    private ProductService productService;

    @Autowired
    private PromotionDetailService promotionDetailService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> addPromotion(Authentication authentication, @Valid @RequestBody PromotionRequest body, HttpServletRequest request) throws UserNotFoundException, ProductNotFoundException, NotFoundException, ParseException, DuplicateException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());
        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
        Date fromDate =null;
        Date endDate = null;
        try {
            fromDate = setToMidnight(format.parse(body.getStartDate()));

        } catch (ParseException e) {
            e.printStackTrace();
            throw new NotFoundException("Lỗi định dạng datetime!");
        }
        try {
            endDate = setToMidnight(format.parse(body.getFinishDate()));

        } catch (ParseException e) {
            e.printStackTrace();
            throw new NotFoundException("Lỗi định dạng datetime!");
        }
        if(promotionService.existsById(body.getId())) {
            throw new DuplicateException("This id is already being used");
        }

        Promotion promotion = new Promotion();
        promotion.setId(body.getId());
        promotion.setStartAt(endDate);
        promotion.setEndAt(endDate);
        promotion.setStaff(staff);
        promotion.setReason(body.getReason());

        List<PromotionDetail> promotionDetails = promotion.getPromotionDetails();

        List<PromotionDetailRequest> listPromotionDetailsRequest = body.getPromotionDetails();
        for(PromotionDetailRequest pdr: listPromotionDetailsRequest) {
            PromotionDetail promotionDetail = new PromotionDetail();
            promotionDetail.setPromotion(promotion);
            Product product = productService.getProductById(pdr.getProductId());
            promotionDetail.setProduct(product);
            promotionDetail.setPercentage(pdr.getPercentage());

            promotionDetails.add(promotionDetail);
        }

        Promotion promotionAfterSave = promotionService.savePromotion(promotion);

        PromotionDto promotionDto = new PromotionDto(promotionAfterSave);
        List<PromotionDetailDto> listPromotionDetailDto = new ArrayList<>();
        List<PromotionDetail> listPromotionDetails = promotion.getPromotionDetails();
        for(PromotionDetail promotionDetail : listPromotionDetails) {
            Product product = promotionDetail.getProduct();
            List<String> listImages = productService.getListImagesStringByProduct(product.getId());

            PromotionDetailDto promotionDetailDto = new PromotionDetailDto(promotionDetail,
                    new ProductDto(product, promotionService.getCurrentPromotionByProduct(product),
                            priceHistoryService.getPriceFromProductId(product.getId()),
                            productService.getSoldQuantity(product.getId()),
                            listImages));
            listPromotionDetailDto.add(promotionDetailDto);
        }
        promotionDto.setPromotionDetails(listPromotionDetailDto);

        PromotionResponse result = new PromotionResponse(1, "Add new promotion successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.CREATED.value(), promotionDto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> updatePromotion(Authentication authentication, @PathVariable String id, @Valid @RequestBody PromotionRequest body, HttpServletRequest request) throws UserNotFoundException, PromotionNotFoundException, ProductNotFoundException, NotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
        Date fromDate =null;
        Date endDate = null;
        try {
            fromDate = setToMidnight(format.parse(body.getStartDate()));

        } catch (ParseException e) {
            e.printStackTrace();
            throw new NotFoundException("Lỗi định dạng datetime!");
        }
        try {
            endDate = setToMidnight(format.parse(body.getFinishDate()));

        } catch (ParseException e) {
            e.printStackTrace();
            throw new NotFoundException("Lỗi định dạng datetime!");
        }

        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());
        Promotion promotion = promotionService.getPromotionById(id);

        promotion.setReason(body.getReason());
        promotion.setStartAt(fromDate);
        promotion.setEndAt(endDate);
        promotion.setStaff(staff);
        promotion.setId(body.getId());

        promotionDetailService.deletePromotionDetailByPromotionId(promotion.getId());

        List<PromotionDetail> updatedDetails = new ArrayList<>();
        List<PromotionDetailRequest> listPromotionDetailsRequest = body.getPromotionDetails();
        for(PromotionDetailRequest pdr: listPromotionDetailsRequest) {
            PromotionDetail promotionDetail = new PromotionDetail();
            promotionDetail.setPromotion(promotion);
            Product product = productService.getProductById(pdr.getProductId());
            promotionDetail.setProduct(product);
            promotionDetail.setPercentage(pdr.getPercentage());

            updatedDetails.add(promotionDetail);
        }

        promotion.setPromotionDetails(updatedDetails);

        Promotion promotionAfterSave = promotionService.savePromotion(promotion);


        // Convert to DTO
        PromotionDto promotionDto = new PromotionDto(promotionAfterSave);
        List<PromotionDetailDto> listPromotionDetailDto = new ArrayList<>();
        List<PromotionDetail> listPromotionDetails = promotion.getPromotionDetails();

        for(PromotionDetail promotionDetail : listPromotionDetails) {
            Product product = promotionDetail.getProduct();
            List<String> listImages = productService.getListImagesStringByProduct(product.getId());

            PromotionDetailDto promotionDetailDto = new PromotionDetailDto(promotionDetail,
                    new ProductDto(product, promotionService.getCurrentPromotionByProduct(product),
                            priceHistoryService.getPriceFromProductId(product.getId()),
                            productService.getSoldQuantity(product.getId()),
                            listImages));
            listPromotionDetailDto.add(promotionDetailDto);
        }
        promotionDto.setPromotionDetails(listPromotionDetailDto);


        PromotionResponse result = new PromotionResponse(1, "Update promotion successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), promotionDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListPromotionsResponse> findPromotionsAdmin(
            @RequestParam(value = "pageNo", required = false) Optional<Integer> pPageNo,
            @RequestParam(value = "pageSize", required = false) Optional<Integer> pPageSize,
            @RequestParam(value = "sortField", required = false) Optional<String> pSortField,
            @RequestParam(value = "sortDirection", required = false) Optional<String> pSortDir,
            HttpServletRequest request) throws ProductNotFoundException {
        int pageNo = 1;
        int pageSize = 10;
        String sortField = "id";
        String sortDirection = "ASC";

        if (pPageNo.isPresent()) {
            pageNo = pPageNo.get();
        }
        if (pPageSize.isPresent()) {
            pageSize = pPageSize.get();
        }
        if (pSortField.isPresent()) {
            String sortFieldTemp = pSortField.get();
            if(sortFieldTemp.trim().equals("name") || sortFieldTemp.trim().equals("id") ||
                    sortFieldTemp.trim().equals("isActive")) {
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


        Page page = promotionService.getListPromotionsAdmin(pageNo, pageSize, sortField, sortDirection);
        List<Promotion> promotions = page.getContent();
        int totalPage = page.getTotalPages();

        List<PromotionDto> listPromotionDto = new ArrayList<>();

        for(Promotion promotion : promotions) {
            PromotionDto promotionDto = new PromotionDto(promotion);


            List<PromotionDetailDto> listPromotionDetailDto = new ArrayList<>();

            List<PromotionDetail> listPromotionDetails = promotion.getPromotionDetails();

            for(PromotionDetail promotionDetail : listPromotionDetails) {
                Product product = productService.getProductById( promotionDetail.getProduct().getId());
                List<String> listImages = productService.getListImagesStringByProduct(product.getId());

                PromotionDetailDto promotionDetailDto = new PromotionDetailDto(promotionDetail,
                        new ProductDto(product, promotionService.getCurrentPromotionByProduct(product),
                                priceHistoryService.getPriceFromProductId(product.getId()),
                                productService.getSoldQuantity(product.getId()),
                                listImages));
                listPromotionDetailDto.add(promotionDetailDto);
            }

            promotionDto.setPromotionDetails(listPromotionDetailDto);
            listPromotionDto.add(promotionDto);
        }


        ListPromotionsResponse result = new ListPromotionsResponse(1, "Get list promotions successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listPromotionDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<PromotionResponse> getPromotionById(@PathVariable String id, HttpServletRequest request) throws PromotionNotFoundException, ProductNotFoundException {
        Promotion promotion = promotionService.getPromotionById(id);

        PromotionDto promotionDto = new PromotionDto(promotion);
        List<PromotionDetailDto> listPromotionDetailDto = new ArrayList<>();
        List<PromotionDetail> listPromotionDetails = promotionDetailService.getPromotionDetailByPromotion(promotion);
        System.out.println(listPromotionDetails.size());
        for(PromotionDetail promotionDetail : listPromotionDetails) {
            Product product = productService.getProductById( promotionDetail.getProduct().getId());
            List<String> listImages = productService.getListImagesStringByProduct(product.getId());

            PromotionDetailDto promotionDetailDto = new PromotionDetailDto(promotionDetail,
                    new ProductDto(product, promotionService.getCurrentPromotionByProduct(product),
                            priceHistoryService.getPriceFromProductId(product.getId()),
                            productService.getSoldQuantity(product.getId()),
                            listImages));
            listPromotionDetailDto.add(promotionDetailDto);
        }
        promotionDto.setPromotionDetails(listPromotionDetailDto);

        PromotionResponse result = new PromotionResponse(1, "Get promotion successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), promotionDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    public static Date setToMidnight(Date date) {
        // Create a new Date object with the same date and time set to midnight (00:00)
        return new Date(date.getYear(), date.getMonth(), date.getDate());
    }

    public static Date setToLastMinute(Date date) {
        // Create a new Date object with the same date and time set to 23:59
        return new Date(date.getYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    }
}
