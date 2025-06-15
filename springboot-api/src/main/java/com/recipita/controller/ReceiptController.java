package com.recipita.controller;

import com.recipita.dto.ReceiptResultDto;
import com.recipita.entity.Receipt;
import com.recipita.service.ReceiptService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> saveReceipt(HttpServletRequest request, @RequestBody ReceiptResultDto dto) {
        String uid = (String) request.getAttribute("uid");
        receiptService.saveReceiptWithUser(uid, dto);
        return ResponseEntity.ok( "レシート保存完了");
    }

    @GetMapping("/user/{uid}")
    public List<Receipt> getAllReceipts(@PathVariable String uid) {
        return receiptService.getReceiptByUser(uid);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateReceipt(
            @PathVariable Long id,
            @RequestBody Receipt updatedReceipt
    ) {
        receiptService.updateReceipt(id, updatedReceipt);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long id) {
        receiptService.deleteReceipt(id);
        return ResponseEntity.noContent().build();
    }
}