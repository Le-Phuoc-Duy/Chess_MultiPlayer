package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.LoginReponse;
import com.example.chess_multiplayer.DTO.RegisterRequest;
import com.example.chess_multiplayer.Service.UserService;
import com.example.chess_multiplayer.config.PricipalCustomer;
import com.example.chess_multiplayer.config.UserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class RegisterController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private AccountController accountController;
    @Autowired
    private UserController userController;
    @MessageMapping("/register")
    @SendToUser("/queue/registerStatus")
    public LoginReponse login(@Payload RegisterRequest message, Principal principal) {
        String username = message.getUsername();
        String password = message.getPassword();
        int ava = message.getAva();
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

                String AccId = accountController.getAccId(username,password);
                String UserId = userController.getIdUserByIDAcc(AccId);
                UserInterceptor.updatePrincipal(principal.getName(),new PricipalCustomer(UserId,"ONLINE"));
                UserInterceptor.changeOnline("INCREASE",UserId);
                return loginReponse;
            } else {
                // Gửi thông báo đăng ký thất bại (tài khoản đã tồn tại) qua WebSocket
                loginReponse.setUserID(null);
                loginReponse.setMessage("Tài khoản đã tồn tại");
                return loginReponse;
            }
        } catch (Exception ex) {
            loginReponse.setUserID(null);
            loginReponse.setMessage("Đăng ký thất bại: " + ex.getMessage());
            return loginReponse;
        }

    }

}
