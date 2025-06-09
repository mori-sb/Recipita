package com.recipita.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeminiVisionService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent\n";

    public String extractTextFromImage(String base64Image) {
        RestTemplate restTemplate = new RestTemplate();

        // JSON body の組み立て
        Map<String, Object> imagePart = Map.of("inlineData", Map.of(
                "mimeType", "image/jpeg",
                "data", base64Image
        ));
        Map<String, Object> textPart = Map.of(
                "text",
                """
                以下の画像は日本のレシートです。画像の内容をOCRし、次の情報を日本語でJSON形式で抽出してください。
                   ---

                   1. **店舗名の候補（1〜2行）**
                      - 店名と思われる行をそのまま抽出してください。住所や支店名が含まれていても構いません。

                   2. **合計金額の候補**
                      - 「合計」「合計金額」「合計（税込）」などの文字列を含む行のみ抽出してください。
                      - 金額だけでなく、行全体（例: 「合計（税込） ¥572」）を返してください。
                      - 以下の語が含まれる行は候補から除外してください：
                        - 「お預かり」「お預り合計」「現金」「お釣り」「小計」「消費税」「クレジット」

                   3. **商品行**
                      - 商品名と金額が一緒に記載された行のみを抽出してください（¥や円を含む行）。
   
                   4. 各商品を以下のカテゴリに分類し、カテゴリごとの合計金額をJSON形式で返してください。
                       使用できるカテゴリは次の通りです（1〜3個まで）： \s
                       「食費」「日用品」「交通費」「飲み代」「衣類」「医療費」「娯楽」「その他」
                       商品が複数ある場合は、カテゴリごとに合計金額を合算してください。
                   ---

                   ### 出力形式（必ずこのJSON形式）

                   ```json
                           {
                             "store_candidates": [
                               "..."
                             ],
                             "total_candidates": [
                               "..."
                             ],
                             "item_lines": [
                               "..."
                             ],
                             "category_summary": {
                               "食費": 1200,
                               "日用品": 540
                             }
                           }
                """
        );

        Map<String, Object> content = Map.of("parts", List.of(textPart, imagePart));
        Map<String, Object> requestBody = Map.of("contents", List.of(content));

        // HTTPヘッダー
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        // POSTリクエスト送信
        ResponseEntity<Map> response = restTemplate.postForEntity(API_URL + "?key=" + apiKey, request, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            var candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                var contentMap = (Map<String, Object>) candidates.get(0).get("content");
                var parts = (List<Map<String, Object>>) contentMap.get("parts");
                var result = parts.stream()
                        .filter(p -> p.containsKey("text"))
                        .map(p -> (String) p.get("text"))
                        .collect(Collectors.joining("\n"));
                return result;
            }
            return "No candidates found.";
        } else {
            return "Error from Gemini API: " + response.getStatusCode();
        }
    }
}
