package com.luv2code.doan.bean;

import javax.persistence.Entity;
import javax.persistence.Id;

public class SoldByCategoryItem {
    private String name;
    private Integer totalSold;

    public SoldByCategoryItem() {
    }

    public SoldByCategoryItem(String name, Integer totalSold) {
        this.name = name;
        this.totalSold = totalSold;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getTotalSold() {
        return totalSold;
    }

    public void setTotalSold(Integer totalSold) {
        this.totalSold = totalSold;
    }
}
