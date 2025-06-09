package com.recipita.controller;

import com.recipita.model.Receipt;
import com.recipita.service.ReceiptService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;

    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @PostMapping
    public String saveReceipt(@RequestBody Receipt receipt) {
        receiptService.saveReceipt(receipt);
        return "レシート保存完了";
    }

    @GetMapping
    public List<Receipt> getAllReceipts() {
        return receiptService.getAllReceipts();
    }
}