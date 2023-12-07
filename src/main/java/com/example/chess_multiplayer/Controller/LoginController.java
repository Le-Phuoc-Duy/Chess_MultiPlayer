package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.LoginRequest;
import com.example.chess_multiplayer.DTO.LoginReponse;
import com.example.chess_multiplayer.Service.AccountService;
import com.example.chess_multiplayer.Service.UserService;
import com.example.chess_multiplayer.config.PricipalCustome;
import com.example.chess_multiplayer.config.UserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
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
    @MessageMapping("/login")
    @SendToUser("/queue/loginStatus")
    public LoginReponse login(LoginRequest message, Principal principal) {
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
                loginReponse.setUserName(username);
                loginReponse.setAva(userService.getUserById(UserId).getAva());
                loginReponse.setMessage("Đăng nhập thành công");
                System.out.println(message.getTempPort());
                UserInterceptor.updatePrincipal(principal.getName(),new PricipalCustome(UserId,"ONLINE"));
                UserInterceptor.printUserMap();
                return loginReponse;
//                messagingTemplate.convertAndSendToUser(message.getTempPort(), "/queue/loginStatus", loginReponse);
            } else {
                // Gửi thông báo thất bại qua WebSocket
                loginReponse.setUserID(null);
                loginReponse.setMessage("Tài khoản hoặc mật khẩu không chính xác");
                return loginReponse;
//                messagingTemplate.convertAndSendToUser(message.getTempPort(), "/queue/loginStatus", loginReponse);
            }
        } catch (Exception ex) {
                loginReponse.setUserID(null);
                loginReponse.setMessage("Đăng nhập thất bại: " + ex.getMessage());
            return loginReponse;
//                messagingTemplate.convertAndSendToUser(message.getTempPort(), "/queue/loginStatus", loginReponse);
        }
    }

}
