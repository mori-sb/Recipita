package com.recipita.controller;

import com.recipita.entity.ScannedRecord;
import com.recipita.service.OcrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/ocr")
public class OrcController {
    @Autowired
    private OcrService ocrService;

    @PostMapping
    public  ResponseEntity<ScannedRecord> uploadImage(@RequestParam("image") MultipartFile file) throws Exception {
        //OSの一時フォルダに .jpg の一時ファイルを作成
        File tempFile = File.createTempFile("upload", ".jpg");
        file.transferTo(tempFile);

        String text = ocrService.extractText(tempFile);
        tempFile.delete();

        ScannedRecord record = new ScannedRecord();
        record.setRawText(text);
        record.setRawText(text);
        record.setDate(LocalDate.now());
        record.setCategory("未分類");
        record.setItemName("自動抽出未実装");
        record.setAmount(0);

        return ResponseEntity.ok(record);
    }
}
