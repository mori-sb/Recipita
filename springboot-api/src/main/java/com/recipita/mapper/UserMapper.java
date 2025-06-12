package com.recipita.mapper;

import com.recipita.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM users WHERE uid = #{uid}")
    User findByUid(String uid);

    @Insert("""
    INSERT INTO users (uid, email, anonymous, created_at)
    VALUES (#{uid}, #{email}, #{anonymous}, NOW())
  """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(User user);
}
