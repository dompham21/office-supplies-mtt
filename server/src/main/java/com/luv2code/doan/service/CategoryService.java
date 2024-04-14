package com.luv2code.doan.service;


import com.luv2code.doan.entity.Category;

import com.luv2code.doan.exceptions.CategoryNotFoundException;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CategoryService {

    public Category getCategoryByName(String name);

    public Page<Category> listByPage(Integer pageNum, String keyword, String sortField, String sortDir);

    public Category getCategoryById(String id) throws CategoryNotFoundException;
    public Page<Category> getCategoryPerPage(Integer pageNum, Integer pageSize);

    public Page<Category> getListCategoriesAdmin( int pageNo, int pageSize, String sortField, String sortDirection, String keyword);

    public Category saveCategory(Category category);


    public void deleteCategory(String id) throws CategoryNotFoundException;

    public void approveCategory(String id) throws CategoryNotFoundException;


    public List<Category> findAllCategory();

    public List<Category> getListCategories();

    public List<Category> getTop5CategoryBestSell();
}
