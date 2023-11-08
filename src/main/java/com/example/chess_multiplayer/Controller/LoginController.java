package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.LoginRequest;
import com.example.chess_multiplayer.Service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.WebSocketMessage;

import java.security.Principal;

@Controller
public class LoginController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired

    private AccountService accountService;
    @MessageMapping("/login")
    public void login(WebSocketMessage<LoginRequest> message, Principal principal) {
        LoginRequest loginRequest = message.getPayload();
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        try {
            // Gọi service để xác thực người dùng
            if (accountService.authenticate(username, password)) {
                // Gửi thông báo thành công qua WebSocket
                messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/loginStatus", "Đăng nhập thành công");
            } else {
                // Gửi thông báo thất bại qua WebSocket
                messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/loginStatus", "Đăng nhập thất bại");
            }
        } catch (Exception ex) {
            // Bắt lấy ngoại lệ (bao gồm cả các ngoại lệ checked) và gửi thông báo lỗi qua WebSocket
            messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/loginStatus", "Đăng nhập thất bại: " + ex.getMessage());
        }
    }

}
