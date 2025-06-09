package com.recipita.dto;

import java.util.List;

public class ReceiptResultDto {
    private String storeName;
    private int totalAmount;
    private List<com.recipita.dto.CategorySummaryDto> categories;

    public ReceiptResultDto() {}

    public ReceiptResultDto(String storeName, int totalAmount, List<com.recipita.dto.CategorySummaryDto> categories) {
        this.storeName = storeName;
        this.totalAmount = totalAmount;
        this.categories = categories;
    }

    // Getters and setters
    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public int getTotalAmount() { return totalAmount; }
    public void setTotalAmount(int totalAmount) { this.totalAmount = totalAmount; }

    public List<com.recipita.dto.CategorySummaryDto> getCategories() { return categories; }
    public void setCategories(List<com.recipita.dto.CategorySummaryDto> categories) { this.categories = categories; }
}
