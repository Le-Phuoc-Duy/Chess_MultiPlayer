package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.LoginRequest;
import com.example.chess_multiplayer.DTO.LoginReponse;
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
public class LoginController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private AccountController accountController;
    @Autowired
    private UserController userController;
    @Autowired
    private UserService userService;
//    private Map<String, String> sessionId = new HashMap<>();
    @MessageMapping("/login")
//    @SendTo("/queue/loginStatus")
    public void login(LoginRequest message) {
        String username = message.getUsername();
        String password = message.getPassword();
        System.out.println(username + password);
        LoginReponse loginReponse = new LoginReponse();
        try {
            if (accountController.authenticate(username, password)) {
                String AccId = accountController.getAccId(username,password);
                String UserId = userController.getIdUserByIDAcc(AccId);
                // Gửi thông báo thành công qua WebSocket
                loginReponse.setUserID(UserId);
                loginReponse.setUserName(message.getUsername());
                loginReponse.setAva(userService.getUserById(UserId).getAva());
                loginReponse.setMessage("Đăng nhập thành công");
                System.out.println(message.getTempPort());
                messagingTemplate.convertAndSendToUser(message.getTempPort(), "/queue/loginStatus", loginReponse);
            } else {
                // Gửi thông báo thất bại qua WebSocket
                loginReponse.setUserID(null);
                loginReponse.setMessage("Tài khoản hoặc mật khẩu không chính xác");
                messagingTemplate.convertAndSendToUser(message.getTempPort(), "/queue/loginStatus", loginReponse);
            }
        } catch (Exception ex) {
                loginReponse.setUserID(null);
                loginReponse.setMessage("Đăng nhập thất bại: " + ex.getMessage());
                messagingTemplate.convertAndSendToUser(message.getTempPort(), "/queue/loginStatus", loginReponse);
        }
    }

}
