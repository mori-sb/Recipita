package com.recipita.dto;

public class CategorySummaryDto {
    private String categoryName;
    private int amount;

    public CategorySummaryDto() {
    }

    public CategorySummaryDto(String categoryName, int amount) {
        this.categoryName = categoryName;
        this.amount = amount;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}
