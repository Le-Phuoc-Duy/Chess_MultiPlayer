package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.config.UserInterceptor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class LogoutController {
    @MessageMapping("/logout")
    public void logout (Principal principal){
        UserInterceptor.removePrincipal(principal.getName());
    }
    @MessageMapping("/ccPrint")
    public void ccPrint (){
        System.out.println("--ccPrint---"); UserInterceptor.printUserMap();
    }


}
