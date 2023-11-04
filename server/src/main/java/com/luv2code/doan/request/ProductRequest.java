package com.luv2code.doan.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductRequest {
    @NotBlank(message = "Id must not be blank")
    @Size(max = 10, message = "Name should be less than 10 characters")
    private String id;

    @NotBlank(message = "Name must not be blank")
    @Size(max = 50, message = "Name should be less than 50 characters")
    private String name;

    @NotBlank(message = "Description must not be blank")
    private String description;

    @NotNull(message = "Price must not be null")
    @Min(message = "Price should be greater than equal 0", value = 0)
    private Float price;

    @NotNull(message = "Image must not be null")
    private List<String> images;

    @NotNull(message = "Category must not be null")
    private String categoryId;

    @NotNull(message = "Brand must not be null")
    private String brandId;

    @NotNull(message = "Supplier must not be null")
    private String supplierId;

    @NotNull(message = "Is active must not be null")
    private Boolean active;

}
