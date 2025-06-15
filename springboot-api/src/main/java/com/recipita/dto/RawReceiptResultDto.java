package com.recipita.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

public class RawReceiptResultDto {
    @JsonProperty("store_candidates")
    private List<String> storeCandidates;

    @JsonProperty("total_candidates")
    private List<String> totalCandidates;

    @JsonProperty("category_summary")
    private Map<String, Integer> categorySummary;

    @JsonProperty("item_lines")
    private List<String> itemLines;

    public List<String> getStoreCandidates() {
        return storeCandidates;
    }

    public void setStoreCandidates(List<String> storeCandidates) {
        this.storeCandidates = storeCandidates;
    }

    public List<String> getTotalCandidates() {
        return totalCandidates;
    }

    public void setTotalCandidates(List<String> totalCandidates) {
        this.totalCandidates = totalCandidates;
    }

    public Map<String, Integer> getCategorySummary() {
        return categorySummary;
    }

    public void setCategorySummary(Map<String, Integer> categorySummary) {
        this.categorySummary = categorySummary;
    }

    public List<String> getItemLines() {
        return itemLines;
    }

    public void setItemLines(List<String> itemLines) {
        this.itemLines = itemLines;
    }
}
