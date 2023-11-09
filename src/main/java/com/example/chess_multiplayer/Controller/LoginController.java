package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.LoginRequest;
import com.example.chess_multiplayer.Service.AccountService;
import com.mysql.cj.log.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
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
    @SendToUser("/topic/public")
    public LoginRequest login(LoginRequest loginRequest, Principal principal) {
//        LoginRequest loginRequest = message.getPayload();
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        System.out.println(username + password);
        System.out.println("printicpal" + principal.toString());
        String tuky = "tu ky .com";
        String scc = "success";
        String fail = "fail";
        LoginRequest ans = new LoginRequest();
//        return loginRequest;
//        return username;
//        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender()); //put nhan 2 tham so: key, value
//        return chatMessage;
        try {
            // Gọi service để xác thực người dùng
            if (accountService.authenticate(username, password)) {
                // Gửi thông báo thành công qua WebSocket
                ans.setUsername("scc");
                ans.setPassword("scc");
                messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/loginStatus", ans);

                return ans;
            } else {
                // Gửi thông báo thất bại qua WebSocket
//                messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/loginStatus", "Đăng nhập thất bại");
                ans.setUsername("fail");
                ans.setPassword("fail");
                return ans;
            }
        } catch (Exception ex) {
            ans.setUsername("ex");
            ans.setPassword("ex");
            return ans;
            // Bắt lấy ngoại lệ (bao gồm cả các ngoại lệ checked) và gửi thông báo lỗi qua WebSocket
//            messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/loginStatus", "Đăng nhập thất bại: " + ex.getMessage());
        }
    }

}