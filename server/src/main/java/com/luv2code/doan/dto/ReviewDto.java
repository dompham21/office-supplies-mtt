package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewDto {
    protected Integer id;


    private ProductDto product;

    private Date date;

    private String comment;

    private Integer vote;

    public ReviewDto(Review review, ProductDto productDto) {
        this.id = review.getId();
        this.product = productDto;
        this.date = review.getDate();
        this.comment = review.getComment();
        this.vote = review.getVote();
    }
}
