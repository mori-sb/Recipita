package com.recipita.dto;

import java.util.List;
import java.util.Map;

public class GeminiParsedResult {
    private List<String> store_candidates;
    private List<String> total_candidates;
    private List<String> item_lines;
    private Map<String, Integer> category_summary;

    // Getters & setters
    public List<String> getStore_candidates() { return store_candidates; }
    public void setStore_candidates(List<String> store_candidates) { this.store_candidates = store_candidates; }

    public List<String> getTotal_candidates() { return total_candidates; }
    public void setTotal_candidates(List<String> total_candidates) { this.total_candidates = total_candidates; }

    public List<String> getItem_lines() { return item_lines; }
    public void setItem_lines(List<String> item_lines) { this.item_lines = item_lines; }

    public Map<String, Integer> getCategory_summary() { return category_summary; }
    public void setCategory_summary(Map<String, Integer> category_summary) { this.category_summary = category_summary; }
}
