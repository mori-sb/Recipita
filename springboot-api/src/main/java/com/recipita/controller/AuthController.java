package com.recipita.controller;

import com.recipita.entity.User;
import com.recipita.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/secure")
    public ResponseEntity<String> secureEndpoint(@RequestHeader("Authorization") String authHeader) throws Exception {
        String idToken = authHeader.replace("Bearer ", "");

        // トークン検証 & 新規ユーザーなら自動登録
        User user = userService.registerIfNotExists(idToken);

        return ResponseEntity.ok("認証成功：UID = " + user.getUid() + ", Email = " + user.getEmail());
    }
}

