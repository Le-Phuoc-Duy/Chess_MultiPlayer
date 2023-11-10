package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.LoginRequest;
import com.example.chess_multiplayer.DTO.LoginReponse;
import com.example.chess_multiplayer.Service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class LoginController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired

    private AccountService accountService;
    @MessageMapping("/login")
//    @SendTo("/queue/loginStatus")
    public void login(LoginRequest message, Principal principal) {
        String username = message.getUsername();
        String password = message.getPassword();
        System.out.println(username + password);
        LoginReponse loginReponse = new LoginReponse();
        try {
            // Gọi service để xác thực người dùng
            if (accountService.authenticate(username, password)) {
                // Gửi thông báo thành công qua WebSocket
                loginReponse.setUserID(accountService.getUserID(username,password));
                loginReponse.setMessage("Đăng nhập thành công");
                messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/loginStatus", loginReponse);
            } else {
                // Gửi thông báo thất bại qua WebSocket
                loginReponse.setUserID(null);
                loginReponse.setMessage("Đăng nhập thất bại");
                messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/loginStatus", loginReponse);
            }
        } catch (Exception ex) {
                loginReponse.setUserID(null);
                loginReponse.setMessage("Đăng nhập thất bại: " + ex.getMessage());
                messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/loginStatus", loginReponse);
        }
    }

}
