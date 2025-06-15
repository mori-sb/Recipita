package com.recipita.mapper;

import com.recipita.entity.ReceiptCategory;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReceiptCategoryMapper {

    @Select("SELECT * FROM receipt_category WHERE receipt_id = #{receiptId}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "receiptId", column = "receipt_id"),
            @Result(property = "categoryName", column = "category_name"),
            @Result(property = "amount", column = "amount")
    })
    List<ReceiptCategory> findByReceiptId(long receiptId);

    @Insert("""
        INSERT INTO receipt_category (receipt_id, category_name, amount)
        VALUES (#{receiptId}, #{categoryName}, #{amount})
    """)
    void insertCategory(ReceiptCategory category);

    @Delete("DELETE FROM receipt_category WHERE receipt_id = #{receiptId}")
    void deleteByReceiptId(Long receiptId);

}

