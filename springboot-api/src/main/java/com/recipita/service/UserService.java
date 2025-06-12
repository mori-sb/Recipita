package com.recipita.service;


import com.recipita.entity.User;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.recipita.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public User registerIfNotExists(String idToken) throws Exception {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        String uid = decodedToken.getUid();
        Map<String, Object> firebaseMap = (Map<String, Object>) decodedToken.getClaims().get("firebase");
        String signInProvider = firebaseMap != null ? (String) firebaseMap.get("sign_in_provider") : "unknown";

        boolean anonymous = "anonymous".equals(signInProvider);
        String email = decodedToken.getEmail();

        User existing = userMapper.findByUid(uid);
        if (existing != null) {
            return existing;
        }

        User user = new User();
        user.setUid(uid);
        user.setAnonymous(anonymous);
        user.setEmail(email);

        userMapper.insert(user); // DB登録
        return user;
    }
}