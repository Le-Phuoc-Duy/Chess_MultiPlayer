package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.LoginRequest;
import com.example.chess_multiplayer.DTO.LoginReponse;
import com.example.chess_multiplayer.DTO.RegisterRequest;
import com.example.chess_multiplayer.Service.AccountService;
import com.example.chess_multiplayer.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
public class RegisterController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private AccountController accountController;
    @Autowired
    private UserController userController;
    @Autowired
    private UserService userService;
    @MessageMapping("/register")
//    @SendTo("/queue/loginStatus")
    public void login(RegisterRequest message) {
        String username = message.getUsername();
        String password = message.getPassword();
        int ava = message.getAva();
        System.out.println(username + password);
        LoginReponse loginReponse = new LoginReponse();
        try {
            // Kiểm tra xem tài khoản đã tồn tại chưa
            if (!accountController.isUsernameExists(username)) {
                // Tạo tài khoản mới
                String userId = userController.registerUser(username, password, ava);

                // Gửi thông báo đăng ký thành công qua WebSocket
                loginReponse.setUserID(userId); // Giả sử có một phương thức getId() trong đối tượng User
                loginReponse.setUserName(username);
                loginReponse.setAva(ava);
                loginReponse.setMessage("Đăng ký thành công");
                messagingTemplate.convertAndSendToUser(message.getTempPort(), "/queue/registerStatus", loginReponse);
            } else {
                // Gửi thông báo đăng ký thất bại (tài khoản đã tồn tại) qua WebSocket
                loginReponse.setUserID(null);
                loginReponse.setMessage("Tài khoản đã tồn tại");
                messagingTemplate.convertAndSendToUser(message.getTempPort(), "/queue/registerStatus", loginReponse);
            }
        } catch (Exception ex) {
            loginReponse.setUserID(null);
            loginReponse.setMessage("Đăng ký thất bại: " + ex.getMessage());
            messagingTemplate.convertAndSendToUser(message.getTempPort(), "/queue/registerStatus", loginReponse);
        }

    }

}
