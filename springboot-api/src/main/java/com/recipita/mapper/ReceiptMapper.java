package com.recipita.mapper;

import com.recipita.model.Receipt;
import com.recipita.model.RecipitaCategory;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface ReceiptMapper {

    @Insert("INSERT INTO receipt (store, total_amount, date, image_path) " +
            "VALUES (#{store}, #{totalAmount}, #{date}, #{imagePath})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insertReceipt(Receipt receipt);

    @Insert({
            "<script>",
            "INSERT INTO receipt_category (receipt_id, category_name, amount) VALUES",
            "<foreach collection='categories' item='cat' separator=','>",
            "(#{cat.receiptId}, #{cat.categoryName}, #{cat.amount})",
            "</foreach>",
            "</script>"
    })
    void insertCategories(@Param("categories") List<RecipitaCategory> categories);

    @Select("SELECT id, store, total_amount, date, image_path FROM receipt ORDER BY date DESC")
    @Results(id = "receiptWithCategories", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "store", column = "store"),
            @Result(property = "totalAmount", column = "total_amount"),
            @Result(property = "date", column = "date"),
            @Result(property = "imagePath", column = "image_path"),
            @Result(property = "categories", column = "id",
                    javaType = List.class,
                    many = @Many(select = "com.recipita.mapper.ReceiptMapper.findCategoriesByReceiptId"))
    })
    List<Receipt> findAllWithCategories();

    @Select("SELECT category_name, amount FROM receipt_category WHERE receipt_id = #{receiptId}")
    @Results({
            @Result(property = "categoryName", column = "category_name"),
            @Result(property = "amount", column = "amount")
    })
    List<RecipitaCategory> findCategoriesByReceiptId(@Param("receiptId") Long receiptId);
}
