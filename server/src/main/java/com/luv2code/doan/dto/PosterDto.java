package com.luv2code.doan.dto;


import com.luv2code.doan.entity.Poster;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PosterDto {
    private String id;

    private String image;
    private String name;
    private Integer type;
    private Boolean isActive;
    private String userId;

    public PosterDto(Poster poster) {
        this.id = poster.getId();
        this.name = poster.getName();
        this.isActive = poster.getIsActive();
        this.image = poster.getImage();
        this.userId = poster.getStaff().getId();
        this.type = poster.getType();
    }
}
