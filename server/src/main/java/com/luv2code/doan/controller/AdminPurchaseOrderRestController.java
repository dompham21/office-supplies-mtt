package com.luv2code.doan.controller;

import com.luv2code.doan.dto.*;
import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.PromotionDetailRequest;
import com.luv2code.doan.request.PromotionRequest;
import com.luv2code.doan.request.PurchaseOrderDetailRequest;
import com.luv2code.doan.request.PurchaseOrderRequest;
import com.luv2code.doan.response.ListPromotionsResponse;
import com.luv2code.doan.response.ListPurchaseOrdersResponse;
import com.luv2code.doan.response.PromotionResponse;
import com.luv2code.doan.response.PurchaseOrderResponse;
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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/purchase-order")
@RequiredArgsConstructor
@Slf4j
public class AdminPurchaseOrderRestController {
    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @Autowired
    private StaffService staffService;

    @Autowired
    private SupplierService supplierService;

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> addPurchaseOrder(Authentication authentication, @Valid @RequestBody PurchaseOrderRequest body, HttpServletRequest request) throws UserNotFoundException, ProductNotFoundException, NotFoundException, ParseException, DuplicateException, SupplierNotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());

        if(purchaseOrderService.existsById(body.getId())) {
            throw new DuplicateException("Mã phiếu nhập đã tồn tại trong hệ thống!");
        }

        Supplier supplier = supplierService.getSupplierById(body.getSupplier());
        PurchaseOrder purchaseOrder = new PurchaseOrder();
        purchaseOrder.setId(body.getId());
        purchaseOrder.setDate(new Date());
        purchaseOrder.setStaff(staff);
        purchaseOrder.setSupplier(supplier);
        purchaseOrder.setIsActive(true);

        List<PurchaseOrderDetail> listPurchaseOrderDetails = purchaseOrder.getPurchaseOrderDetails();

        List<PurchaseOrderDetailRequest> listPurchaseOrderDetailRequest = body.getPurchaseOrderDetails();
        for(PurchaseOrderDetailRequest pdr: listPurchaseOrderDetailRequest) {
            PurchaseOrderDetail purchaseOrderDetail = new PurchaseOrderDetail();
            purchaseOrderDetail.setPurchaseOrder(purchaseOrder);
            Product product = productService.getProductById(pdr.getProductId());
            purchaseOrderDetail.setProduct(product);
            purchaseOrderDetail.setQuantity(pdr.getQuantity());
            purchaseOrderDetail.setUnitPrice(pdr.getUnitPrice());
            listPurchaseOrderDetails.add(purchaseOrderDetail);
        }

        PurchaseOrder purchaseOrderAfterSave = purchaseOrderService.savePurchaseOrder(purchaseOrder);

        PurchaseOrderDto purchaseOrderDto = new PurchaseOrderDto(purchaseOrderAfterSave);
        List<PurchaseOrderDetailDto> listPurchaseOrderDetailDto = new ArrayList<>();
        for(PurchaseOrderDetail purchaseOrderDetail : listPurchaseOrderDetails) {
            Product product = purchaseOrderDetail.getProduct();
            List<String> listImages = productService.getListImagesStringByProduct(product.getId());

            PurchaseOrderDetailDto purchaseOrderDetailDto = new PurchaseOrderDetailDto(purchaseOrderDetail,
                    new ProductDto(product, promotionService.getCurrentPromotionByProduct(product),
                            priceHistoryService.getPriceFromProductId(product.getId()),
                            productService.getSoldQuantity(product.getId()),
                            listImages));
            listPurchaseOrderDetailDto.add(purchaseOrderDetailDto);
        }
        purchaseOrderDto.setPurchaseOrderDetails(listPurchaseOrderDetailDto);

        PurchaseOrderResponse result = new PurchaseOrderResponse(1, "Add new purchase order successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.CREATED.value(), purchaseOrderDto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListPurchaseOrdersResponse> findPurchaseOrdersAdmin(
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


        Page page = purchaseOrderService.getListPurchaseOrdersAdmin(pageNo, pageSize, sortField, sortDirection);
        List<PurchaseOrder> purchaseOrders = page.getContent();
        int totalPage = page.getTotalPages();

        List<PurchaseOrderDto> listPurchaseOrderDto = new ArrayList<>();

        for(PurchaseOrder purchaseOrder : purchaseOrders) {
            PurchaseOrderDto purchaseOrderDto = new PurchaseOrderDto(purchaseOrder);


            List<PurchaseOrderDetailDto> listPurchaseOrderDetailsDto = new ArrayList<>();

            List<PurchaseOrderDetail> listPromotionDetails = purchaseOrder.getPurchaseOrderDetails();

            for(PurchaseOrderDetail purchaseOrderDetail : listPromotionDetails) {
                Product product = productService.getProductById(purchaseOrderDetail.getProduct().getId());
                List<String> listImages = productService.getListImagesStringByProduct(product.getId());

                PurchaseOrderDetailDto purchaseOrderDetailDto = new PurchaseOrderDetailDto(purchaseOrderDetail,
                        new ProductDto(product, promotionService.getCurrentPromotionByProduct(product),
                                priceHistoryService.getPriceFromProductId(product.getId()),
                                productService.getSoldQuantity(product.getId()),
                                listImages));
                listPurchaseOrderDetailsDto.add(purchaseOrderDetailDto);
            }

            purchaseOrderDto.setPurchaseOrderDetails(listPurchaseOrderDetailsDto);
            listPurchaseOrderDto.add(purchaseOrderDto);
        }


        ListPurchaseOrdersResponse result = new ListPurchaseOrdersResponse(1, "Get list purchase order successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listPurchaseOrderDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<PurchaseOrderResponse> getPurchaseById(@PathVariable String id, HttpServletRequest request) throws PromotionNotFoundException, ProductNotFoundException, NotFoundException {
        PurchaseOrder purchaseOrder = purchaseOrderService.getPurchaseOrderById(id);

        PurchaseOrderDto purchaseOrderDto = new PurchaseOrderDto(purchaseOrder);
        List<PurchaseOrderDetailDto> listPurchaseOrderDetailDto = new ArrayList<>();
        List<PurchaseOrderDetail> listPurchaseOrderDetails = purchaseOrder.getPurchaseOrderDetails();

        for(PurchaseOrderDetail purchaseOrderDetail : listPurchaseOrderDetails) {
            Product product =  purchaseOrderDetail.getProduct();
            List<String> listImages = productService.getListImagesStringByProduct(product.getId());

            PurchaseOrderDetailDto purchaseOrderDetailDto = new PurchaseOrderDetailDto(purchaseOrderDetail,
                    new ProductDto(product, promotionService.getCurrentPromotionByProduct(product),
                            priceHistoryService.getPriceFromProductId(product.getId()),
                            productService.getSoldQuantity(product.getId()),
                            listImages));
            listPurchaseOrderDetailDto.add(purchaseOrderDetailDto);
        }
        purchaseOrderDto.setPurchaseOrderDetails(listPurchaseOrderDetailDto);

        PurchaseOrderResponse result = new PurchaseOrderResponse(1, "Get purchase order successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), purchaseOrderDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/active", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListPurchaseOrdersResponse> findPurchaseOrdersActiveAdmin(
            HttpServletRequest request) throws ProductNotFoundException {

        List<PurchaseOrder> purchaseOrders = purchaseOrderService.getAllByIsActiveTrue();

        List<PurchaseOrderDto> listPurchaseOrderDto = new ArrayList<>();

        for(PurchaseOrder purchaseOrder : purchaseOrders) {
            PurchaseOrderDto purchaseOrderDto = new PurchaseOrderDto(purchaseOrder);


            List<PurchaseOrderDetailDto> listPurchaseOrderDetailsDto = new ArrayList<>();

            List<PurchaseOrderDetail> listPromotionDetails = purchaseOrder.getPurchaseOrderDetails();

            for(PurchaseOrderDetail purchaseOrderDetail : listPromotionDetails) {
                Product product = productService.getProductById(purchaseOrderDetail.getProduct().getId());
                List<String> listImages = productService.getListImagesStringByProduct(product.getId());

                PurchaseOrderDetailDto purchaseOrderDetailDto = new PurchaseOrderDetailDto(purchaseOrderDetail,
                        new ProductDto(product, promotionService.getCurrentPromotionByProduct(product),
                                priceHistoryService.getPriceFromProductId(product.getId()),
                                productService.getSoldQuantity(product.getId()),
                                listImages));
                listPurchaseOrderDetailsDto.add(purchaseOrderDetailDto);
            }

            purchaseOrderDto.setPurchaseOrderDetails(listPurchaseOrderDetailsDto);
            listPurchaseOrderDto.add(purchaseOrderDto);
        }


        ListPurchaseOrdersResponse result = new ListPurchaseOrdersResponse(1, "Get list purchase order successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listPurchaseOrderDto, null, null
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }






}
