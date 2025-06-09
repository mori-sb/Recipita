package com.recipita.model;

import java.time.LocalDate;
import java.util.List;

public class Receipt {
    private Long id;
    private String store;
    private Integer totalAmount;
    private LocalDate date;
    private String imagePath;

    // 子カテゴリ
    private List<RecipitaCategory> categories;

    // --- getter / setter ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStore() { return store; }
    public void setStore(String store) { this.store = store; }

    public Integer getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Integer totalAmount) { this.totalAmount = totalAmount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public List<RecipitaCategory> getCategories() { return categories; }
    public void setCategories(List<RecipitaCategory> categories) { this.categories = categories; }
}
