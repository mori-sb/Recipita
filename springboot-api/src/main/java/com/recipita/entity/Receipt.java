package com.recipita.entity;

import java.time.LocalDate;
import java.util.List;

public class Receipt {
    private Long id;
    private Integer userId;
    private String store;
    private Integer totalAmount;
    private LocalDate date;
    private String imagePath;
    private List<ReceiptCategory> categories;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStore() {
        return store;
    }

    public void setStore(String store) {
        this.store = store;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public List<ReceiptCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<ReceiptCategory> categories) {
        this.categories = categories;
    }
}
