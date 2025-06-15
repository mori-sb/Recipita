package com.recipita.service.ocr;

import com.recipita.dto.CategorySummaryDto;
import com.recipita.dto.ReceiptResultDto;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.*;
import java.util.stream.Collectors;

@Service
public class ReceiptFormatterService {

    // 「合計」と明記されているが、禁句は含まない行のみを対象
    private static final Pattern VALID_TOTAL_PATTERN =
            Pattern.compile("合計[^0-9]*([0-9,]+)円?");
    private static final List<String> FORBIDDEN_KEYWORDS = List.of("お預", "釣", "現金", "クレジット", "小計", "消費税");

    public static Optional<Integer> extractValidTotal(List<String> totalCandidates, Map<String, Integer> categorySummary) {
        int categorySum = categorySummary.values().stream().mapToInt(Integer::intValue).sum();
        System.out.println("[DEBUG] カテゴリ合計: " + categorySum);

        for (String line : totalCandidates) {
            if (FORBIDDEN_KEYWORDS.stream().anyMatch(line::contains)) continue;

            Matcher m = VALID_TOTAL_PATTERN.matcher(line);
            if (m.find()) {
                String amountStr = m.group(1) != null ? m.group(1) : m.group(2);
                if (amountStr == null) continue;

                int amount = Integer.parseInt(amountStr.replaceAll(",", ""));
                System.out.println("[DEBUG] 候補行: " + line + " → 抽出金額: " + amount);
                if (amount == categorySum) {
                    System.out.println("[DEBUG] ✔ カテゴリ合計と一致した合計金額候補: " + amount);
                    return Optional.of(amount);
                }
            }
        }

        System.out.println("[WARN] 一致する合計が見つからず。fallback実行");

        // fallback: 最初にマッチした金額を返す（例：合計金額のみのチェック）
        for (String line : totalCandidates) {
            if (FORBIDDEN_KEYWORDS.stream().anyMatch(line::contains)) continue;

            Matcher m = VALID_TOTAL_PATTERN.matcher(line);
            if (m.find()) {
                String amountStr = m.group(1) != null ? m.group(1) : m.group(2);
                if (amountStr == null) continue;

                int amount = Integer.parseInt(amountStr.replaceAll(",", ""));
                System.out.println("[DEBUG] fallback合計候補: " + amount);
                return Optional.of(amount);
            }
        }

        return Optional.empty();
    }

    public static String formatForFrontend(String storeName, int total, Map<String, Integer> categorySummary) {
        StringBuilder sb = new StringBuilder();
        sb.append("**店舗名:** ").append(storeName).append(" \n");
        sb.append("**金額（合計）:** ").append(String.format("%,d円", total)).append(" \n");
        sb.append("**カテゴリ:** \n");

        for (Map.Entry<String, Integer> entry : categorySummary.entrySet()) {
            sb.append(" - ").append(entry.getKey()).append(": ")
                    .append(String.format("%,d円", entry.getValue())).append(" \n");
        }
        return sb.toString();
    }

    public static boolean validateTotalWithCategories(int total, Map<String, Integer> categorySummary) {
        int sum = categorySummary.values().stream().mapToInt(i -> i).sum();
        return sum == total;
    }

    public ReceiptResultDto format(String storeName, int total, Map<String, Integer> categorySummary) {
        List<CategorySummaryDto> categories = categorySummary.entrySet().stream()
                .map(entry -> new CategorySummaryDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return new ReceiptResultDto(storeName, total, categories);
    }


    public static Map<String, Integer> filterCategorySummaryByTotal(Map<String, Integer> categorySummary, int total) {
        Map<String, Integer> filtered = new LinkedHashMap<>();
        int runningSum = 0;

        for (Map.Entry<String, Integer> entry : categorySummary.entrySet()) {
            if (runningSum + entry.getValue() <= total) {
                filtered.put(entry.getKey(), entry.getValue());
                runningSum += entry.getValue();
            } else {
                break; // これ以上加算すると超える
            }
        }
        return filtered;
    }

    public Map<String, Integer> forceAdjustCategorySummary(Map<String, Integer> originalSummary, int totalAmount) {
        int sum = originalSummary.values().stream().mapToInt(Integer::intValue).sum();

        if (sum == totalAmount) return originalSummary;
        if (originalSummary.isEmpty()) return Map.of();

        // 1カテゴリしかない場合は totalAmount をそのまま割り当て
        if (originalSummary.size() == 1) {
            String key = originalSummary.keySet().iterator().next();
            return Map.of(key, totalAmount);
        }

        // 比率配分（小数点誤差は最後で吸収）
        double ratio = (double) totalAmount / sum;
        Map<String, Integer> adjusted = new LinkedHashMap<>();
        int runningTotal = 0;
        int i = 0;
        int last = originalSummary.size() - 1;

        for (Map.Entry<String, Integer> entry : originalSummary.entrySet()) {
            int amount = (i == last)
                    ? totalAmount - runningTotal
                    : (int) Math.floor(entry.getValue() * ratio);
            adjusted.put(entry.getKey(), amount);
            runningTotal += amount;
            i++;
        }

        return adjusted;
    }

}
