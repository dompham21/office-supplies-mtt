package com.luv2code.doan.repository;

import com.luv2code.doan.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    @Query("Select p from Product p WHERE p.name = :name")
    public Product getProductByName(String name);

    @Query("SELECT p FROM Product  p WHERE p.isActive <> FALSE AND p.categories.id = :categoryId")
    public List<Product> findAllByCategory(String categoryId, Pageable pageable);

    @Query("SELECT p FROM Product  p WHERE p.isActive <> FALSE")
    public List<Product> getListProducts(Pageable pageable);

    @Query("SELECT COUNT(p.id) from Product p WHERE p.categories.id = :categoryId")
    public int countByCategory(String categoryId);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %?1%")
    public Page<Product> findAll(String keyword, Pageable pageable);

    @Query("SELECT COUNT(p.id) from Product p WHERE p.id = :id")
    public Long countById(String id);

    @Query("SELECT p FROM Product  p WHERE p.isActive <> FALSE ORDER BY p.registrationDate DESC")
    public Page<Product> findLatestProduct(Pageable pageable);

    @Query("SELECT p FROM Product  p WHERE p.isActive <> FALSE")
    public Page<Product> findBestSellProduct(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isActive <> FALSE " +
            "AND ((:catId = 'all' AND p.categories.id is not null ) OR (:catId <> 'all' AND p.categories.id = :catId))" +
            "AND ((:brandId = 'all' AND p.brands.id is not null ) OR (:brandId <> 'all' AND p.brands.id = :brandId))")
    public Page<Product> searchFilterProduct(String catId, String brandId, Pageable pageable);


    @Query("SELECT p FROM Product p WHERE (p.name LIKE %:keyword%) " +
            "AND p.isActive <> FALSE " +
            "AND p.categories.id in :catIds")
    public Page<Product> searchWithKeywordFilterProductWithCategory(String keyword, List<String> catIds, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (p.name LIKE %:keyword%) " +
            "AND p.isActive <> FALSE")
    public Page<Product> searchWithKeywordFilterProduct(String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (p.name LIKE %:keyword% OR p.categories.name LIKE %:keyword%  OR p.brands.name LIKE %:keyword% )")
    public Page<Product> getListProductsAdminWithKeyword(String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p")
    public Page<Product> getListProductsAdmin(Pageable pageable);


    @Query(value = "SELECT [dbo].[FUNC_LAY_GIA_SAN_PHAM_CAO_NHAT]() as price", nativeQuery = true)
    public float getMaxPrice();

    @Query("SELECT name FROM Product where name like %:keyword%")
    public Page<String> search(String keyword,  Pageable pageable);

    boolean existsById(String id);

    Boolean existsByName(String name);

    @Query(value = "EXEC LAY_SP_KHUYEN_MAI", nativeQuery = true)
    public List<Product> getListProductPromotion();

    @Query(value = "EXEC LAY_SP_BAN_CHAY", nativeQuery = true)
    public List<Product> getListProductBestSell();

    @Query(value = "SELECT [dbo].[FUNC_LAY_SL_BAN_SAN_PHAM](:productId) as sl", nativeQuery = true)
    public int getSoldQuantity(String productId);

    @Query(value = "SELECT * FROM dbo.product WHERE created_at >= DATEADD(DAY, -120, GETDATE()) AND is_active = 1 ORDER BY created_at DESC", nativeQuery = true)
    public List<Product> getProductNew();

    public Product getProductById(String id);
}
