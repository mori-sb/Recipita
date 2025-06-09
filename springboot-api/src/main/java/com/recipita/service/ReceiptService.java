package com.recipita.service;

import com.recipita.mapper.ReceiptMapper;
import com.recipita.model.Receipt;
import com.recipita.model.RecipitaCategory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReceiptService {

    private final ReceiptMapper receiptMapper;

    public ReceiptService(ReceiptMapper receiptMapper) {
        this.receiptMapper = receiptMapper;
    }

    @Transactional
    public void saveReceipt(Receipt receipt) {
        receiptMapper.insertReceipt(receipt);

        List<RecipitaCategory> categories = receipt.getCategories();
        if (categories != null && !categories.isEmpty()) {
            for (RecipitaCategory cat : categories) {
                cat.setReceiptId(receipt.getId());
            }
            receiptMapper.insertCategories(categories);
        }
    }

    public List<Receipt> getAllReceipts() {
        return receiptMapper.findAllWithCategories();
    }
}
