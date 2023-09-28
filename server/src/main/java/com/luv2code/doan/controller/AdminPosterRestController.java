package com.luv2code.doan.controller;


import com.luv2code.doan.dto.PosterDto;
import com.luv2code.doan.dto.ProductDto;
import com.luv2code.doan.dto.ReviewDto;
import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.PosterRequest;
import com.luv2code.doan.response.*;
import com.luv2code.doan.service.AccountService;
import com.luv2code.doan.service.PosterService;
import com.luv2code.doan.service.StaffService;
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
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/poster")
@RequiredArgsConstructor
@Slf4j
public class AdminPosterRestController {
    @Autowired
    private PosterService posterService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private StaffService staffService;

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> addPoster(Authentication authentication, @Valid @RequestBody PosterRequest body, HttpServletRequest request) throws CategoryNotFoundException, IOException, UserNotFoundException, NotFoundException, DuplicateException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        if(posterService.existsById(body.getId())) {
            throw new DuplicateException("This id is already being used");
        }
        else if(posterService.existsByName(body.getName())) {
            throw new DuplicateException("This name is already being used");
        }
        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());

        Poster poster = new Poster();
        poster.setIsActive(body.getActive());
        poster.setName(body.getName());
        poster.setType(body.getType());
        poster.setImage(body.getImage());
        poster.setStaff(staff);
        poster.setId(body.getId());


        Poster posterAfterSave = posterService.savePoster(poster);

        PosterDto posterDto = new PosterDto(posterAfterSave);
        PosterResponse result = new PosterResponse(1, "Add new poster successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), posterDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> updatePoster(Authentication authentication, @PathVariable String id, @Valid @RequestBody PosterRequest body, HttpServletRequest request) throws PosterNotFoundException, UserNotFoundException, NotFoundException, DuplicateException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();


        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());
        Poster poster = posterService.getPosterById(id);

        if(!(poster.getName().equals(body.getName())) && posterService.existsByName(body.getName())) {
            throw new DuplicateException("This name is already being used");
        }

        poster.setIsActive(body.getActive());
        poster.setName(body.getName());
        poster.setImage(body.getImage());
        poster.setType(body.getType());
        poster.setStaff(staff);


        Poster posterAfterSave = posterService.savePoster(poster);

        PosterDto posterDto = new PosterDto(posterAfterSave);

        PosterResponse result = new PosterResponse(1, "Update poster successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), posterDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deletePoster(@PathVariable String id, HttpServletRequest request) throws  PosterNotFoundException {

        posterService.deletePoster(id);

        BaseResponse result = new BaseResponse(1, "Delete poster successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/approve/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> approvePoster(@PathVariable String id, HttpServletRequest request) throws PosterNotFoundException {

        posterService.approvePoster(id);

        BaseResponse result = new BaseResponse(1, "Approve poster successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListPostersResponse> findPostersAdmin(
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
        if (pKeyword.isPresent()) {
            keyword = pKeyword.get();
        }

        log.info("get poster");

        Page page = posterService.getListPostersAdmin(pageNo, pageSize, sortField, sortDirection, keyword);
        List<Poster> posters = page.getContent();
        int totalPage = page.getTotalPages();
        List<PosterDto> listPosterDto = new ArrayList<>();;

        for(Poster p : posters) {
            PosterDto posterDto = new PosterDto(p);
            listPosterDto.add(posterDto);
        }

        ListPostersResponse result = new ListPostersResponse(1, "Get list posters successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listPosterDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<PosterResponse> getPosterById(@PathVariable String id, HttpServletRequest request) throws CategoryNotFoundException, PosterNotFoundException {
        Poster poster = posterService.getPosterById(id);

        PosterDto posterDto = new PosterDto(poster);
        PosterResponse result = new PosterResponse(1, "Get poster successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), posterDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
