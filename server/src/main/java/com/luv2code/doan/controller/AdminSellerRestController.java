package com.luv2code.doan.controller;

import com.luv2code.doan.dto.CustomerDto;
import com.luv2code.doan.dto.SellerDto;
import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Seller;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.response.*;
import com.luv2code.doan.service.CustomerService;
import com.luv2code.doan.service.RoleService;
import com.luv2code.doan.service.SellerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/seller")
@RequiredArgsConstructor
@Slf4j
public class AdminSellerRestController {
    private final CustomerService customerService;

    @Autowired
    private SellerService sellerService;

    @Autowired
    private RoleService roleService;

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deleteSeller(@PathVariable Integer id, HttpServletRequest request) throws NotFoundException {

        sellerService.deleteSeller(id);

        BaseResponse result = new BaseResponse(1, "Delete customer successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/lock/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> lockSeller(@PathVariable Integer id, HttpServletRequest request) throws NotFoundException {

        sellerService.lockSeller(id);

        BaseResponse result = new BaseResponse(1, "Lock seller successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/unlock/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> unlockSeller(@PathVariable Integer id, HttpServletRequest request) throws NotFoundException {

        sellerService.unlockSeller(id);

        BaseResponse result = new BaseResponse(1, "Unlock seller successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/approve/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> approveSeller(@PathVariable Integer id, HttpServletRequest request) throws NotFoundException {

        sellerService.approveSeller(id);

        BaseResponse result = new BaseResponse(1, "Approve customer successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListSellerResponse> findSellersAdmin(
            @RequestParam(value = "status", required = false) Optional<List<Boolean>> pStatus,
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
        List<Boolean> status = null;

        if (pPageNo.isPresent()) {
            pageNo = pPageNo.get();
        }
        if (pPageSize.isPresent()) {
            pageSize = pPageSize.get();
        }
        if (pSortField.isPresent()) {
            String sortFieldTemp = pSortField.get();
            if(sortFieldTemp.trim().equals("registrationDate") || sortFieldTemp.trim().equals("id")
                    || sortFieldTemp.trim().equals("name")) {
                sortField = sortFieldTemp.trim();
            }
        }
        if (pSortDir.isPresent()) {
            String sortDirTemp = pSortDir.get();
            if(sortDirTemp.trim().equalsIgnoreCase("asc") || sortDirTemp.trim().equalsIgnoreCase("desc")) {
                sortDirection = sortDirTemp.trim();
            }
        }
        if (pKeyword.isPresent()) {
            keyword = pKeyword.get();
        }
        if(pStatus.isPresent()) {
            status = pStatus.get();
        }

        Page page = sellerService.getListSellersAdmin(pageNo, pageSize, sortField, sortDirection, keyword, status);
        List<Seller> sellers = page.getContent();
        int totalPage = page.getTotalPages();


        List<SellerDto> listUsersDto = new ArrayList<>();
        for(Seller u : sellers) {
            listUsersDto.add(new SellerDto(u));
        }



        ListSellerResponse result = new ListSellerResponse(1, "Get list sellers successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listUsersDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<SellerResponse> getUserById(@PathVariable Integer id, HttpServletRequest request) throws NotFoundException {
       System.out.println(id + "");
        Seller user = sellerService.getSellerById(id);
        SellerDto userDto = new SellerDto(user);

        SellerResponse result = new SellerResponse(1, "Get user successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), userDto);
        return new ResponseEntity<SellerResponse>(result, HttpStatus.OK);
    }
}
