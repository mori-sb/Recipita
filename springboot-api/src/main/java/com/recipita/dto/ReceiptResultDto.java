package com.recipita.dto;

import java.util.ArrayList;
import java.util.List;

public class ReceiptResultDto {
    private String store;
    private int totalAmount;
    private List<CategorySummaryDto> categories;

    public ReceiptResultDto() {}

    public ReceiptResultDto(String store, int totalAmount, List<CategorySummaryDto> categories) {
        this.store = store;
        this.totalAmount = totalAmount;
        this.categories = categories;
    }

    public String getStore() {
        return store;
    }

    public void setStore(String store) {
        this.store = store;
    }

    public int getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(int totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<CategorySummaryDto> getCategories() {
        return categories;
    }

    public void setCategories(List<CategorySummaryDto> categories) {
        this.categories = categories;
    }
}
