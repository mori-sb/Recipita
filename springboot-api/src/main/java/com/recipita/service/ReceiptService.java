package com.recipita.service;

import com.recipita.dto.CategorySummaryDto;
import com.recipita.dto.ReceiptResultDto;
import com.recipita.entity.ReceiptCategory;
import com.recipita.entity.User;
import com.recipita.entity.Receipt;
import com.recipita.mapper.ReceiptCategoryMapper;
import com.recipita.mapper.ReceiptMapper;
import com.recipita.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReceiptService {

    private final UserMapper userMapper;
    private final ReceiptMapper receiptMapper;
    private final ReceiptCategoryMapper categoryMapper;

    public ReceiptService(UserMapper userMapper, ReceiptMapper receiptMapper, ReceiptCategoryMapper categoryMapper) {
        this.userMapper = userMapper;
        this.receiptMapper = receiptMapper;
        this.categoryMapper = categoryMapper;
    }

    public void saveReceiptWithUser(String uid, ReceiptResultDto dto) {
        User user = userMapper.findByUid(uid);
        if(user == null) throw new RuntimeException("ユーザーが存在しません: uid=" + uid);

        Receipt receipt = new Receipt();
        receipt.setUserId(user.getId());
        receipt.setStore(dto.getStore());
        receipt.setTotalAmount(dto.getTotalAmount());
        receipt.setDate(LocalDate.now());

        receiptMapper.insertReceipt(receipt);

        for (CategorySummaryDto catDto : dto.getCategories()) {
            ReceiptCategory category = new ReceiptCategory();
            category.setReceiptId(receipt.getId());
            category.setCategoryName(catDto.getCategoryName());
            category.setAmount(catDto.getAmount());
            categoryMapper.insertCategory(category);
        }
    }

    public List<Receipt> getReceiptByUser(String uid)
    {
        User user = userMapper.findByUid(uid);
        if (user == null) return List.of();

        List<Receipt> receipts = receiptMapper.findByUserId(user.getId());

        for (Receipt receipt : receipts) {
            List<ReceiptCategory> categories = categoryMapper.findByReceiptId(receipt.getId());
            receipt.setCategories(categories);
        }

        return receipts;
    }

    public void updateReceipt(Long id, Receipt updatedReceipt) {
        Receipt existing = receiptMapper.findById(id);
        if (existing == null) throw new RuntimeException("レシートが存在しません");

        existing.setStore(updatedReceipt.getStore());
        existing.setTotalAmount(updatedReceipt.getTotalAmount());
        System.out.println(updatedReceipt.getTotalAmount());
        receiptMapper.updateReceipt(existing);

        // カテゴリを全部一旦削除して、再登録（シンプルな実装）
        categoryMapper.deleteByReceiptId(id);
        for (ReceiptCategory cat : updatedReceipt.getCategories()) {
            cat.setReceiptId(id);
            categoryMapper.insertCategory(cat);
        }
    }

    public void deleteReceipt(Long id) {
        Receipt receipt = receiptMapper.findById(id);
        if (receipt == null) {
            throw new RuntimeException("レシートが存在しません");
        }

        categoryMapper.deleteByReceiptId(id); // 先に子テーブル削除
        receiptMapper.deleteReceipt(id);      // 次にレシート本体削除
    }
}
