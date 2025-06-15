package com.recipita.mapper;

import com.recipita.entity.Receipt;
import com.recipita.entity.ReceiptCategory;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReceiptMapper {

    @Select("SELECT * FROM receipt WHERE user_id = #{userId}")
    @Results(id = "receiptMap", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "userId", column = "user_id"),
            @Result(property = "store", column = "store"),
            @Result(property = "totalAmount", column = "total_amount"),
            @Result(property = "date", column = "date"),
            @Result(property = "imagePath", column = "image_path")
    })
    List<Receipt> findByUserId(int userId);

    @Select("SELECT * FROM receipt WHERE id = #{id}")
    Receipt findById(Long id);

    @Select("SELECT * FROM receipt_category WHERE receipt_id = #{receiptId}")
    List<ReceiptCategory> findCategoriesByReceiptId(int receiptId);

    @Insert("INSERT INTO receipt (user_id, store, total_amount, date, image_path) " +
            "VALUES (#{userId}, #{store}, #{totalAmount}, #{date}, #{imagePath})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insertReceipt(Receipt receipt);

    @Update("UPDATE receipt SET store = #{store}, total_amount = #{totalAmount} WHERE id = #{id}")
    void updateReceipt(Receipt receipt);

    @Delete("DELETE FROM receipt WHERE id = #{id}")
    void deleteReceipt(Long id);
}
