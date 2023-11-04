package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.repository.CategoryRepository;
import com.luv2code.doan.repository.ImageProductRepository;
import com.luv2code.doan.repository.ProductRepository;
import com.luv2code.doan.request.ProductRequest;
import com.luv2code.doan.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ProductServiceImpl implements ProductService {
    private final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);


    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ImageProductRepository imageProductRepository;

    @Autowired
    private BrandService brandService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ImageProductService imageProductService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @Autowired
    private SupplierService supplierService;



    public Product getProductByName(String name) {
        Product product = productRepository.getProductByName(name);

        return product;
    }

    @Override
    @Transactional
    public Product updateProduct(ProductRequest body, Staff staff) throws ProductNotFoundException, DuplicateException, BrandNotFoundException, CategoryNotFoundException, SupplierNotFoundException {

        Product product = this.getProductById(body.getId());

        if(!(product.getName().equals(body.getName())) && this.existsByName(body.getName())) {
            throw new DuplicateException("Tên sản phẩm không được trùng!");
        }
        Brand brand = brandService.getBrandById(body.getBrandId());
        Category category = categoryService.getCategoryById(body.getCategoryId());
        Supplier supplier = supplierService.getSupplierById(body.getSupplierId());

        product.setIsActive(body.getActive());
        product.setName(body.getName());
        product.setDescription(body.getDescription());
        product.setBrands(brand);
        product.setCategories(category);
        product.setSuppliers(supplier);

        Product productAfterSave = this.saveProduct(product);

        List<ImageProduct> listImagesProduct = this.getListImagesByProduct(productAfterSave.getId());
        Set<String> existingPaths = new HashSet<>();
        for (ImageProduct image : listImagesProduct) {
            existingPaths.add(image.getPath());
        }

        for (String path : body.getImages()) {
            if (!existingPaths.contains(path)) {
                ImageProduct imageProduct = new ImageProduct();
                imageProduct.setProduct(productAfterSave);
                imageProduct.setPath(path);
                imageProductService.addImageProduct(imageProduct);
            }
        }

        for (ImageProduct imageProduct: listImagesProduct) {
            if(!body.getImages().contains(imageProduct.getPath())) {
                imageProductService.deleteImageProduct(imageProduct);
            }
        }

        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setPrice(body.getPrice());
        priceHistory.setStaff(staff);
        priceHistory.setApplyDate(new Date());
        priceHistory.setCreateDate(new Date());
        priceHistory.setProduct(productAfterSave);

        priceHistoryService.savePriceHistory(priceHistory);

        return productAfterSave;
    }

    @Override
    @Transactional
    public Product addProduct(ProductRequest body, Staff staff) throws DuplicateException, BrandNotFoundException, CategoryNotFoundException, SupplierNotFoundException {
        Brand brand = brandService.getBrandById(body.getBrandId());
        Category category = categoryService.getCategoryById(body.getCategoryId());
        Supplier supplier = supplierService.getSupplierById(body.getSupplierId());



        if(this.existsById(body.getId().trim())) {
            throw new DuplicateException("Mã sản phẩm không được trùng");

        }
        else if(this.existsByName(body.getName())) {
            throw new DuplicateException("Tên sản phẩm không được trùng");
        }

        Product product = new Product();
        product.setId(body.getId());
        product.setIsActive(body.getActive());
        product.setName(body.getName());
        product.setDescription(body.getDescription());
        product.setInStock(0);
        product.setSuppliers(supplier);
        product.setBrands(brand);
        product.setCategories(category);
        product.setRegistrationDate(new Date());
        Product productAfterSave = this.saveProduct(product);


        // Set image
        List<String> listImages = body.getImages();

        for(String pathImage : listImages) {
            ImageProduct imageProduct = new ImageProduct();
            imageProduct.setProduct(productAfterSave);
            imageProduct.setPath(pathImage);
            imageProductService.addImageProduct(imageProduct);
        }

        // set price history
        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setProduct(productAfterSave);
        priceHistory.setStaff(staff);
        priceHistory.setApplyDate(new Date());
        priceHistory.setCreateDate(new Date());
        priceHistory.setPrice(body.getPrice());

        priceHistoryService.savePriceHistory(priceHistory);

        return productAfterSave;
    }


    public int getCountByCategoryId(String categoryId) throws CategoryNotFoundException {
        try {
            categoryRepository.findById(categoryId).get();
            return (int) productRepository.countByCategory(categoryId);
        }
        catch(NoSuchElementException ex) {
            throw new CategoryNotFoundException("Could not find any category with ID " + categoryId);

        }
    }

    public int getCount() {
        return (int) productRepository.count();
    }

    public List<Product> getAllByCategoryId(String categoryId, int pageNo, int pageSize, String sortField, String sortDirection) throws CategoryNotFoundException {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);

        try {
            categoryRepository.findById(categoryId).get();
        }
        catch(NoSuchElementException ex) {
            throw new CategoryNotFoundException("Could not find any category with ID " + categoryId);

        }
        return productRepository.findAllByCategory(categoryId, pageable);
    }

    public List<Product> getListProducts( int pageNo, int pageSize, String sortField, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);
        return productRepository.getListProducts(pageable);
    }

    public Page<Product> getListProductsSearch( int pageNo, int pageSize, String sortField, String sortDirection, String keyword, List<String> listCategoryIds) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);
        if(listCategoryIds != null) {
            return productRepository.searchWithKeywordFilterProductWithCategory(keyword, listCategoryIds, pageable);
        }
        else {
            return productRepository.searchWithKeywordFilterProduct(keyword, pageable);
        }
    }

    public Page<Product> getListProductsAdmin( int pageNo, int pageSize, String sortField, String sortDirection, String keyword) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);
        if(keyword != null) {
            return productRepository.getListProductsAdminWithKeyword(keyword, pageable);
        }
        else {
            return productRepository.getListProductsAdmin(pageable);
        }
    }

    public Product getProductById(String id) throws ProductNotFoundException {
        try {
            Product product = productRepository.findById(id).get();
            return product;

        }
        catch(NoSuchElementException ex) {
            throw new ProductNotFoundException("Could not find any product with ID " + id);

        }
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }


    public void deleteProduct(String id) throws ProductNotFoundException {
        try {
            Product product = productRepository.findById(id).get();
            product.setIsActive(false);
            productRepository.save(product);

        }
        catch(NoSuchElementException ex) {
            throw new ProductNotFoundException("Could not find any product with ID " + id);
        }
    }

    public void approveProduct(String id) throws ProductNotFoundException {
        try {
            Product product = productRepository.findById(id).get();
            product.setIsActive(true);
            productRepository.save(product);

        }
        catch(NoSuchElementException ex) {
            throw new ProductNotFoundException("Could not find any product with ID " + id);
        }
    }

    public Page<Product> listLatestProduct() {
        Pageable pageable = PageRequest.of(0, 10);
        return productRepository.findLatestProduct(pageable);
    }

    public Page<Product> listBestSellProduct() {
        Pageable pageable = PageRequest.of(0,10);
        return productRepository.findBestSellProduct(pageable);
    }

    @Override
    public Boolean existsById(String productId) {
        return productRepository.existsById(productId);
    }

    @Override
    public Boolean existsByName(String name) {
        return productRepository.existsByName(name.trim());
    }


    public float getMaxPrice() {
        return productRepository.getMaxPrice();
    }

    public Page<String> getSuggest(String keyword) {
        Pageable pageable = PageRequest.of(0, 10);
        return productRepository.search(keyword, pageable);
    }

    public List<Product> getListProductPromotion() {
        return productRepository.getListProductPromotion();
    }

    @Override
    public List<Product> getListProductBestSell() {
        return productRepository.getListProductBestSell();
    }

    @Override
    public List<Product> getProductNew() {
        return productRepository.getProductNew();
    }

    @Override
    public int getSoldQuantity(String productId) {
        return productRepository.getSoldQuantity(productId);
    }

    @Override
    public List<ImageProduct> getListImagesByProduct(String productId) {
        return imageProductRepository.getListImagesByProduct(productId);
    }

    @Override
    public List<String> getListImagesStringByProduct(String productId) {
        return imageProductRepository.getListImagesStringByProduct(productId);
    }


}