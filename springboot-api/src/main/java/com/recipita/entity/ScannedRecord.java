package com.recipita.entity;

import java.time.LocalDate;

public class ScannedRecord {

    private Long id;                 // 主キー
    private String itemName;        // 商品名・購入内容（OCRで推定）
    private int amount;             // 金額
    private String category;        // 食品・日用品などのカテゴリ（自動 or 手動）
    private LocalDate date;         // 購入日（またはスキャン日）
    private String rawText;         // OCRで読み取った全文（解析や再分類に使える）

    public ScannedRecord() {
        // デフォルトコンストラクタ（MyBatisやJPAが必要とする）
    }

    public ScannedRecord(Long id, String itemName, int amount, String category, LocalDate date, String rawText) {
        this.id = id;
        this.itemName = itemName;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.rawText = rawText;
    }

    // Getter & Setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getRawText() {
        return rawText;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }
}
