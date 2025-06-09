package com.recipita.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recipita.dto.GeminiParsedResult;
import com.recipita.dto.ReceiptResultDto;
import com.recipita.service.GeminiVisionService;
import com.recipita.service.ReceiptFormatterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/gemini-ocr")
public class GeminiScanController {

    @Autowired
    private GeminiVisionService geminiVisionService;

    @Autowired
    private ReceiptFormatterService receiptFormatterService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<?> analyzeReceipt(@RequestBody Map<String, String> request) {
        try {
            String base64Image = request.get("base64Image");
            String geminiJson = geminiVisionService.extractTextFromImage(base64Image);

            // 🔧 Markdownブロック除去
            if (geminiJson.startsWith("```json")) {
                geminiJson = geminiJson.replaceFirst("```json", "")
                        .replace("```", "")
                        .trim();
            }

            GeminiParsedResult parsed = objectMapper.readValue(geminiJson, GeminiParsedResult.class);

            Optional<Integer> totalOpt = receiptFormatterService.extractValidTotal(
                    parsed.getTotal_candidates(),
                    parsed.getCategory_summary()
            );

            if (totalOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("合計金額が抽出できませんでした");
            }

            int total = totalOpt.get();

            // ✅ カテゴリの合計がオーバーしている場合に補正
            Map<String, Integer> fixedSummary = receiptFormatterService.validateTotalWithCategories(total, parsed.getCategory_summary())
                    ? parsed.getCategory_summary()
                    : receiptFormatterService.filterCategorySummaryByTotal(parsed.getCategory_summary(), total);

            String storeName = parsed.getStore_candidates().isEmpty() ? "不明" : parsed.getStore_candidates().get(0);
            Map<String, Integer> adjustedSummary = receiptFormatterService.forceAdjustCategorySummary(
                    parsed.getCategory_summary(),
                    total
            );
            ReceiptResultDto dto = receiptFormatterService.format(storeName, total, adjustedSummary);

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
