package com.recipita.controller;


import com.recipita.entity.User;
import com.recipita.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/init")
    public User initUser(@RequestHeader("Authorization") String authHeader) throws Exception {
        String idToken = authHeader.replace("Bearer ", "");
        return userService.registerIfNotExists(idToken);
    }
}
