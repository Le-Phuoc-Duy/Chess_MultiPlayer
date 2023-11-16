package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class UserController {
    @Autowired
    private UserService userService;
    public String getIdUserByIDAcc(String idAcc){
        return userService.getIdUserByIdAcc(idAcc);
    }
}
