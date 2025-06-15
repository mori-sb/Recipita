package com.recipita.service.ocr;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.recipita.dto.RawReceiptResultDto;
import com.recipita.dto.ReceiptResultDto;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ReceiptAnalysisService {

    private final GeminiVisionService geminiVisionService;
    private final ReceiptFormatterService receiptFormatterService;

    public ReceiptAnalysisService(GeminiVisionService geminiVisionService,
                                  ReceiptFormatterService receiptFormatterService) {
        this.geminiVisionService = geminiVisionService;
        this.receiptFormatterService = receiptFormatterService;
    }

    public ReceiptResultDto analyzeAndFormat(String base64Image) throws JsonProcessingException {
        RawReceiptResultDto raw = geminiVisionService.extractTextFromImage(base64Image);
        System.out.println("raw" + raw);

        int total = ReceiptFormatterService.extractValidTotal(
                raw.getTotalCandidates(),
                raw.getCategorySummary()
        ).orElseThrow(() -> new RuntimeException("合計金額が取得できません"));

        Map<String, Integer> adjusted = receiptFormatterService.forceAdjustCategorySummary(
                raw.getCategorySummary(), total
        );

        String storeName = raw.getStoreCandidates().isEmpty()
                ? "不明店舗"
                : raw.getStoreCandidates().get(0);

        return receiptFormatterService.format(storeName, total, adjusted); // ✅ ReceiptResultDto が返る
    }
}