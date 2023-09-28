package com.luv2code.doan.repository;

import com.luv2code.doan.entity.Product;
import com.luv2code.doan.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer>  {
    @Query("SELECT r FROM Review r WHERE r.product.id = :id")
    public Page<Review> findReviewByProduct(String id, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.product.id = :id")
    public List<Review> findAllReviewByProduct(String id);

    @Query("SELECT r FROM Review r WHERE r.customer.id = :userId ORDER BY r.id DESC")
    public Page<Review> findReviewByUser(Integer userId, Pageable pageable);

    @Query("SELECT count(r.id) FROM Review r WHERE r.product.id = :id AND r.vote = :starNum")
    public Integer countStarNumByProduct(Integer id, Integer starNum);

    @Query("SELECT count(r.id) from Review r WHERE r.id = :id")
    Long countById(Integer id);

    @Query("SELECT COUNT(r.id) from Review r WHERE r.product.id = :productId")
    public int countByProductId(String productId);

    @Query("SELECT r from Review r WHERE r.product.id = :productId AND r.customer.id = :userId")
    public Review findReviewByUserAndProduct(Integer userId, String productId);

    @Query("SELECT r from Review r WHERE r.id = :id AND r.customer.id = :userId")
    public Review findReviewByIdAndUserId(Integer id, Integer userId);

    @Query("SELECT r from Review r WHERE r.product.id = :productId AND r.customer.id = :userId")
    public Review findReviewByProductIdAndUserId(String productId, Integer userId);
}
