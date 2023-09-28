package com.luv2code.doan.repository;

import com.luv2code.doan.entity.ImageProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.awt.*;
import java.util.List;


@Repository
public interface ImageProductRepository extends JpaRepository<ImageProduct, Integer> {
    @Query("Select p.path from ImageProduct p WHERE p.product.id = :productId")
    public List<String> getListImagesStringByProduct(String productId);

    @Query("Select p from ImageProduct p WHERE p.product.id = :productId")
    public List<ImageProduct> getListImagesByProduct(String productId);

    @Modifying
    @Query("DELETE from ImageProduct p WHERE p.id = :id")
    public void deleteImageProductById(Integer id);
}
