package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.Service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class AccountController {
    @Autowired
    private AccountService accountService;
    public String getAccId(String username, String password){
        return accountService.getAccID(username,password);
    }
    public boolean authenticate(String username, String password){
        return accountService.authenticate(username,password);
    }

    public boolean isUsernameExists(String username) {
        return accountService.isUsernameExists(username);
    }
}
