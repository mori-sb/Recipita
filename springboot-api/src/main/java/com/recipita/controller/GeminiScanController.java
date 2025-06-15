package com.recipita.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recipita.dto.ReceiptResultDto;
import com.recipita.service.ocr.GeminiVisionService;
import com.recipita.service.ocr.ReceiptAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gemini-ocr")
public class GeminiScanController {

    @Autowired
    private GeminiVisionService geminiVisionService;

    @Autowired
    private ReceiptAnalysisService receiptAnalysisService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<?> analyzeReceipt(@RequestBody Map<String, String> request) {
        try {
            String base64Image = request.get("base64Image");
            ReceiptResultDto formatted = receiptAnalysisService.analyzeAndFormat(base64Image);

            return ResponseEntity.ok(formatted);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

}