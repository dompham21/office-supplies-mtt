package com.luv2code.doan.controller;

import com.luv2code.doan.exceptions.BrandNotFoundException;
import com.luv2code.doan.exceptions.CategoryNotFoundException;
import com.luv2code.doan.response.UploadImageResponse;
import com.luv2code.doan.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Date;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class ImageRestController {
    @Autowired
    private StorageService storageService;

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public ResponseEntity<?> uploadImage(@RequestParam(value = "file") MultipartFile file, HttpServletRequest request) throws BrandNotFoundException, CategoryNotFoundException, IOException {
        String url = storageService.upload(file);

        UploadImageResponse result = new UploadImageResponse(1, "Upload image successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), url);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
