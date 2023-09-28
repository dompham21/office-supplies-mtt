package com.luv2code.doan.controller;

import com.luv2code.doan.dto.ProductDto;
import com.luv2code.doan.response.*;
import com.luv2code.doan.entity.Product;
import com.luv2code.doan.exceptions.CategoryNotFoundException;
import com.luv2code.doan.exceptions.ProductNotFoundException;
import com.luv2code.doan.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
@Slf4j
public class ProductRestController {

    @Autowired
    private ProductService productService;

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListProductResponse> findProducts(
            @RequestParam(value = "pageNo", required = false) Optional<Integer> pPageNo,
            @RequestParam(value = "pageSize", required = false) Optional<Integer> pPageSize,
            @RequestParam(value = "sortField", required = false) Optional<String> pSortField,
            @RequestParam(value = "sortDirection", required = false) Optional<String> pSortDir,
            @RequestParam(value = "categoryId", required = false) Optional<String> pCategoryId,
            HttpServletRequest request) throws CategoryNotFoundException {
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
            sortField = pSortField.get();
        }
        if (pSortDir.isPresent()) {
            sortDirection = pSortDir.get();
        }

        int totalPage;
        List<Product> products;

        if (pCategoryId.isPresent()) {
            String categoryId = pCategoryId.get();
            totalPage = (int) Math.ceil((double) (productService.getCountByCategoryId(categoryId)) / pageSize);
            products = productService.getAllByCategoryId(categoryId, pageNo, pageSize, sortField, sortDirection);
        } else {
            totalPage = (int) Math.ceil((double) (productService.getCount()) / pageSize);
            products = productService.getListProducts(pageNo, pageSize, sortField, sortDirection);
        }
        List<ProductDto> listProductsDto = new ArrayList<>();
        for(Product p : products) {
            List<String> listImage = productService.getListImagesStringByProduct(p.getId());

            listProductsDto.add(new ProductDto(p, promotionService.getCurrentPromotionByProduct(p),
                    priceHistoryService.getPriceFromProductId(p.getId()),
                    productService.getSoldQuantity(p.getId()),
                    listImage));
        }

        ListProductResponse result = new ListProductResponse(1, "Get list products successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listProductsDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/detail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ProductResponse> getProductById(@PathVariable String id, HttpServletRequest request) throws ProductNotFoundException {
        Product product = productService.getProductById(id);

        List<String> listImage = productService.getListImagesStringByProduct(id);
        ProductDto productDto = new ProductDto(product, promotionService.getCurrentPromotionByProduct(product),
                priceHistoryService.getPriceFromProductId(product.getId()),
                productService.getSoldQuantity(product.getId()),
                listImage);

        ProductResponse result = new ProductResponse(1, "Get product successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), productDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> searchProduct(@RequestParam(value = "pageNo", required = false) Optional<Integer> pPageNo,
                                           @RequestParam(value = "pageSize", required = false) Optional<Integer> pPageSize,
                                           @RequestParam(value = "priceMin", required = false) Optional<Float> pPriceMin,
                                           @RequestParam(value = "priceMax", required = false) Optional<Float> pPriceMax,
                                           @RequestParam(value = "sortField", required = false) Optional<String> pSortField,
                                           @RequestParam(value = "sortDirection", required = false) Optional<String> pSortDir,
                                           @RequestParam(value = "categoryIds", required = false) Optional<List<String>> pCategoryIds,
                                           @RequestParam("keyword") String keyword, HttpServletRequest request){

        int pageNo = 1;
        int pageSize = 10;
        String sortField = "registrationDate";
        String sortDirection = "DESC";
        List<String> listCategoryIds = null;

        if(pCategoryIds.isPresent()) {
            listCategoryIds = pCategoryIds.get();

        }
        if (pPageNo.isPresent()) {
            pageNo = pPageNo.get();
        }
        if (pPageSize.isPresent()) {
            pageSize = pPageSize.get();
        }
        if (pSortField.isPresent()) {
            String sortFieldTemp = pSortField.get();
            if(sortFieldTemp.trim().equals("registrationDate") || sortFieldTemp.trim().equals("id")) {
                sortField = sortFieldTemp.trim();
            }
        }
        if (pSortDir.isPresent()) {
            String sortDirTemp = pSortDir.get();
            if(sortDirTemp.trim().equalsIgnoreCase("asc") || sortDirTemp.trim().equalsIgnoreCase("desc")) {
                sortDirection = sortDirTemp.trim();
            }
        }


        int totalPage = 0;
        List<Product> products = new ArrayList<>();

        Page page = productService.getListProductsSearch(pageNo, pageSize, sortField, sortDirection, keyword, listCategoryIds);
        products = page.getContent();
        totalPage = page.getTotalPages();

        List<ProductDto> listProductsDto = new ArrayList<>();
        for(Product p : products) {
            List<String> listImage = productService.getListImagesStringByProduct(p.getId());

            listProductsDto.add(new ProductDto(p, promotionService.getCurrentPromotionByProduct(p),
                    priceHistoryService.getPriceFromProductId(p.getId()),
                    productService.getSoldQuantity(p.getId()),
                    listImage));
        }



        if(pSortField.isPresent() && pSortField.get().equals("soldQuantity")) {
            listProductsDto = listProductsDto.stream()
                    .filter(product -> product.getSoldQuantity() > 0)
                    .sorted(Comparator.comparingInt(ProductDto::getSoldQuantity))
                    .collect(Collectors.toList());

            totalPage = (listProductsDto.size() + pageSize - 1) / pageSize;
        }

        if(pSortField.isPresent() && pSortField.get().equals("price")) {

            if(sortDirection.equalsIgnoreCase("asc")) {
                listProductsDto = listProductsDto.stream()
                        .sorted(Comparator.comparingDouble(ProductDto::getPriceAfterDiscount))
                        .collect(Collectors.toList());
            }
            else {
                listProductsDto = listProductsDto.stream()
                        .sorted(Comparator.comparingDouble(ProductDto::getPriceAfterDiscount).reversed())
                        .collect(Collectors.toList());
            }
            totalPage = (listProductsDto.size() + pageSize - 1) / pageSize;
        }

        if(pPriceMin.isPresent() && pPriceMax.isPresent()) {

            listProductsDto = listProductsDto.stream()
                    .filter(product -> product.getPrice() >= pPriceMin.get() && product.getPrice() <= pPriceMax.get())
                    .collect(Collectors.toList());
            totalPage = (listProductsDto.size() + pageSize - 1) / pageSize;
        }

        ListProductResponse result = new ListProductResponse(1, "Get list products successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listProductsDto, totalPage, pageNo
        );

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/suggest", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getSuggest(@RequestParam("keyword") String keyword, HttpServletRequest request){

        Page page = productService.getSuggest(keyword);
        List<String> listSuggest = page.getContent();

        ListSuggestResponse result = new ListSuggestResponse(1, "Get list suggest successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listSuggest
        );

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/getMaxPrice", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getMaxPrice(HttpServletRequest request){

        MaxPriceResponse result = new MaxPriceResponse(1, "Get max price successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                productService.getMaxPrice()
        );

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/promotion", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListProductResponse> findProductsPromotion(HttpServletRequest request) {
        List<Product> listProduct = productService.getListProductPromotion();



        List<ProductDto> listProductsDto = new ArrayList<>();
        for(Product p : listProduct) {
            List<String> listImage = productService.getListImagesStringByProduct(p.getId());

            listProductsDto.add(new ProductDto(p, promotionService.getCurrentPromotionByProduct(p),
                    priceHistoryService.getPriceFromProductId(p.getId()),
                    productService.getSoldQuantity(p.getId()),
                    listImage));
        }

        ListProductResponse result = new ListProductResponse(1, "Get list products successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listProductsDto, 0, 0
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/best-sell", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListProductResponse> findProductsBestSell(HttpServletRequest request) {
        List<Product> listProduct = productService.getListProductBestSell();
        log.info(String.valueOf(listProduct.size()));
        List<ProductDto> listProductsDto = new ArrayList<>();

        for(Product p : listProduct) {
            int soldQuantity = productService.getSoldQuantity(p.getId());
            if(soldQuantity > 0) {
                List<String> listImage = productService.getListImagesStringByProduct(p.getId());

                listProductsDto.add(new ProductDto(p, promotionService.getCurrentPromotionByProduct(p),
                        priceHistoryService.getPriceFromProductId(p.getId()), soldQuantity,
                        listImage));
            }

        }

        ListProductResponse result = new ListProductResponse(1, "Get list products successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listProductsDto, 0, 0
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/new", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListProductResponse> findProductsNew(HttpServletRequest request) {
        List<Product> listProduct = productService.getProductNew();

        List<ProductDto> listProductsDto = new ArrayList<>();
        for(Product p : listProduct) {
            List<String> listImage = productService.getListImagesStringByProduct(p.getId());

            listProductsDto.add(new ProductDto(p, promotionService.getCurrentPromotionByProduct(p),
                    priceHistoryService.getPriceFromProductId(p.getId()),
                    productService.getSoldQuantity(p.getId()),
                    listImage));
        }

        ListProductResponse result = new ListProductResponse(1, "Get list products successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listProductsDto, 0, 0
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

}
