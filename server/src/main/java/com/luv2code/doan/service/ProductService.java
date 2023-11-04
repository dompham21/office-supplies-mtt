package com.luv2code.doan.service;

import com.luv2code.doan.entity.Account;
import com.luv2code.doan.entity.ImageProduct;
import com.luv2code.doan.entity.Product;
import com.luv2code.doan.entity.Staff;
import com.luv2code.doan.exceptions.*;

import com.luv2code.doan.request.ProductRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    public static final int PRODUCT_PER_PAGE = 9;


    public Product getProductByName(String name);


    public Product updateProduct(ProductRequest product, Staff staff) throws ProductNotFoundException, DuplicateException, BrandNotFoundException, CategoryNotFoundException, SupplierNotFoundException;

    public Product addProduct(ProductRequest product, Staff staff) throws ProductNotFoundException, DuplicateException, BrandNotFoundException, CategoryNotFoundException, SupplierNotFoundException;

    public int getCountByCategoryId(String categoryId) throws CategoryNotFoundException;

    public int getCount();

    public List<Product> getAllByCategoryId(String categoryId, int pageNo, int pageSize, String sortField, String sortDirection) throws CategoryNotFoundException;

    public List<Product> getListProducts( int pageNo, int pageSize, String sortField, String sortDirection);

    public Page<Product> getListProductsSearch( int pageNo, int pageSize, String sortField, String sortDirection, String keyword, List<String> listCategoryIds);

    public Page<Product> getListProductsAdmin( int pageNo, int pageSize, String sortField, String sortDirection, String keyword);

    public Product getProductById(String id) throws ProductNotFoundException;

    public Product saveProduct(Product product);


    public void deleteProduct(String id) throws ProductNotFoundException;

    public void approveProduct(String id) throws ProductNotFoundException;

    public Page<Product> listLatestProduct();

    public Page<Product> listBestSellProduct();

    public Boolean existsById(String productId);

    public Boolean existsByName(String name);

    public float getMaxPrice();

    public Page<String> getSuggest(String keyword);

    public List<Product> getListProductPromotion();
    public List<Product> getListProductBestSell();
    public List<Product> getProductNew();
    public int getSoldQuantity(String productId);
    public List<ImageProduct> getListImagesByProduct(String productId);
    public List<String> getListImagesStringByProduct(String productId);
}
