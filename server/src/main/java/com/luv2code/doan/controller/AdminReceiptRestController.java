package com.luv2code.doan.controller;

import com.luv2code.doan.dto.ProductDto;
import com.luv2code.doan.dto.PurchaseOrderDetailDto;
import com.luv2code.doan.dto.PurchaseOrderDto;
import com.luv2code.doan.dto.ReceiptDto;
import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.PurchaseOrderDetailRequest;
import com.luv2code.doan.request.PurchaseOrderRequest;
import com.luv2code.doan.request.ReceiptRequest;
import com.luv2code.doan.response.ListPurchaseOrdersResponse;
import com.luv2code.doan.response.ListReceiptsResponse;
import com.luv2code.doan.response.PurchaseOrderResponse;
import com.luv2code.doan.response.ReceiptResponse;
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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/receipt")
@RequiredArgsConstructor
@Slf4j
public class AdminReceiptRestController {
    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Autowired
    private ReceiptService receiptService;

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
    public ResponseEntity<?> addReceipt(Authentication authentication, @Valid @RequestBody ReceiptRequest body, HttpServletRequest request) throws UserNotFoundException, ProductNotFoundException, NotFoundException, ParseException, DuplicateException, SupplierNotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());

        if(receiptService.existsById(body.getId())) {
            throw new DuplicateException("Mã phiếu nhập đã tồn tại trong hệ thống!");
        }

        PurchaseOrder purchaseOrder = purchaseOrderService.getPurchaseOrderById(body.getPurchaseOrder());
        Receipt receipt = new Receipt();
        receipt.setId(body.getId());
        receipt.setDate(new Date());
        receipt.setStaff(staff);
        receipt.setPurchaseOrder(purchaseOrder);

        purchaseOrder.setIsActive(false);
        purchaseOrderService.savePurchaseOrder(purchaseOrder);

        List<PurchaseOrderDetail> listPurchaseOrderDetails = purchaseOrder.getPurchaseOrderDetails();

        List<ReceiptDetail> listReceiptDetail = receipt.getReceiptDetails();
        for(PurchaseOrderDetail pod : listPurchaseOrderDetails){
            ReceiptDetail receiptDetail = new ReceiptDetail();
            Product product = pod.getProduct();
            product.setInStock(product.getInStock() + pod.getQuantity());
            productService.saveProduct(product);

            receiptDetail.setReceipt(receipt);
            receiptDetail.setProduct(product);
            receiptDetail.setUnitPrice(pod.getUnitPrice());
            receiptDetail.setQuantity(pod.getQuantity());
            listReceiptDetail.add(receiptDetail);
        }

        receiptService.saveReceipt(receipt);

        PurchaseOrderDto purchaseOrderDto = new PurchaseOrderDto(receipt.getPurchaseOrder());

        List<PurchaseOrderDetailDto> listPurchaseOrderDetailDto = new ArrayList<>();

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

        ReceiptDto receiptDto = new ReceiptDto(receipt, purchaseOrderDto);

        ReceiptResponse result = new ReceiptResponse(1, "Add new receipt successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.CREATED.value(), receiptDto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListReceiptsResponse> findReceiptsAdmin(
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


        Page page = receiptService.getListReceiptAdmin(pageNo, pageSize, sortField, sortDirection);
        List<Receipt> receipts = page.getContent();
        int totalPage = page.getTotalPages();

        List<ReceiptDto> listReceiptsDto = new ArrayList<>();

        for(Receipt receipt : receipts) {
            PurchaseOrderDto purchaseOrderDto = new PurchaseOrderDto(receipt.getPurchaseOrder());

            List<PurchaseOrderDetailDto> listPurchaseOrderDetailDto = new ArrayList<>();

            List<PurchaseOrderDetail> listPurchaseOrderDetails = receipt.getPurchaseOrder().getPurchaseOrderDetails();

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

            ReceiptDto receiptDto = new ReceiptDto(receipt, purchaseOrderDto);
            listReceiptsDto.add(receiptDto);

        }




        ListReceiptsResponse result = new ListReceiptsResponse(1, "Get list purchase order successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listReceiptsDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ReceiptResponse> getReceiptById(@PathVariable String id, HttpServletRequest request) throws PromotionNotFoundException, ProductNotFoundException, NotFoundException {
        Receipt receipt = receiptService.getReceiptById(id);

        PurchaseOrderDto purchaseOrderDto = new PurchaseOrderDto(receipt.getPurchaseOrder());

        List<PurchaseOrderDetailDto> listPurchaseOrderDetailDto = new ArrayList<>();

        List<PurchaseOrderDetail> listPurchaseOrderDetails = receipt.getPurchaseOrder().getPurchaseOrderDetails();

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

        ReceiptDto receiptDto = new ReceiptDto(receipt, purchaseOrderDto);


        ReceiptResponse result = new ReceiptResponse(1, "Get receipt successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), receiptDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


}
