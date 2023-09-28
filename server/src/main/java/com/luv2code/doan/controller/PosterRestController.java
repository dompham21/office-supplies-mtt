package com.luv2code.doan.controller;

import com.luv2code.doan.dto.PosterDto;
import com.luv2code.doan.response.ListPostersResponse;
import com.luv2code.doan.entity.Poster;
import com.luv2code.doan.service.PosterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/poster")
@RequiredArgsConstructor
@Slf4j
public class PosterRestController {
    @Autowired
    private PosterService posterService;

    @GetMapping("")
    public ResponseEntity<List<Poster>> getListPoster(HttpServletRequest request) {
        List<Poster> listPosters = posterService.getListPosters();

        List<PosterDto> listPosterDto = new ArrayList<>();;

        for(Poster p : listPosters) {
            PosterDto posterDto = new PosterDto(p);
            listPosterDto.add(posterDto);
        }


        ListPostersResponse result = new ListPostersResponse(1, "Get list posters successfully!",
                request.getMethod(),new Date().getTime(),HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listPosterDto, null, null);
        return new ResponseEntity(result, HttpStatus.OK);

    }
}
