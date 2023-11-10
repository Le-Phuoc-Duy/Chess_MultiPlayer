package com.example.chess_multiplayer.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
@Controller
public class WebsocketController {
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebsocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

//    @EventListener
//    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
//        String sessionId = event.getMessage().getHeaders().get("simpSessionId").toString();
//
//        // Kiểm tra xem event.getUser() có khả dụng hay không
//        String clientAddress = event.getUser() != null ? event.getUser().getName() : "Không có thông tin người dùng";
//
//        // Truy xuất thông tin địa chỉ IP và port
//        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
//        String clientIp = accessor.getHost();
//        String clientPort = accessor.getAck();
//
//        System.out.println("Client #" + sessionId + " đã kết nối từ địa chỉ: " + clientIp + ":" + clientPort);
//
//        String successMessage = "Kết nối thành công!";
//        messagingTemplate.convertAndSendToUser(sessionId, "/queue/connect", successMessage);
//    }
//
//
//    @EventListener
//    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
//        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//        String sessionId = headerAccessor.getSessionId();
//
//        // Kiểm tra xem event.getUser() có khả dụng hay không
//        String clientAddress = event.getUser() != null ? event.getUser().getName() : "Không có thông tin người dùng";
//
//        System.out.println("Client #" + sessionId + " đã ngắt kết nối từ địa chỉ: " + clientAddress);
//
//        String errorMessage = "Kết nối thất bại!";
//        System.out.println(errorMessage);
//    }

}
