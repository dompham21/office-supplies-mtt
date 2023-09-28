package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Product;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ImageProductDto {
    private Integer id;
    private String path;
}
