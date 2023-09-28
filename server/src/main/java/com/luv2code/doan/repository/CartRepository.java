package com.luv2code.doan.repository;


import com.luv2code.doan.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    @Query("SELECT c FROM Cart c WHERE c.customer.id = :id")
    public List<Cart> findByUserId(Integer id);

    @Query("SELECT c FROM Cart c WHERE c.product.id = :productId AND c.customer.id = :userId")
    public Cart findByUserIdAndProductId(Integer userId, String productId);

    @Modifying
    @Query("UPDATE Cart c SET c.quantity = :quantity WHERE c.product.id = :productId AND c.customer.id = :userId")
    public void updateQuantity(Integer quantity, Integer userId, String productId);

    @Modifying
    @Query("DELETE FROM Cart c WHERE c.product.id = :productId AND c.customer.id = :userId ")
    public void deleteByUserAndProduct(Integer userId, String productId);

    @Modifying
    @Query("DELETE FROM Cart  c WHERE  c.customer.id = :userId")
    public void deleteByUser(Integer userId);

}
