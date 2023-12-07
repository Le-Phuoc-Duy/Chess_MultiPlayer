package com.example.chess_multiplayer.config;

import org.springframework.messaging.support.ChannelInterceptor;

import java.util.*;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
public class UserInterceptor implements ChannelInterceptor {
    private static Map<String, PricipalCustome> userMap = new HashMap<>();
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        System.out.println("preSend");
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            Object raw = message.getHeaders().get(SimpMessageHeaderAccessor.NATIVE_HEADERS);

            if (raw instanceof Map) {
                Object tempPort = ((Map) raw).get("tempPort");

                if (tempPort instanceof ArrayList) {
                    String name = ((ArrayList<String>) tempPort).get(0).toString();
                    PricipalCustome pricipalCustome = userMap.get(name);
                    System.out.println("name" + name);
                    //userID null, trước khi vào chức năng login
                    if ("null".equals(name)){
                        System.out.println("null");
                        final String randomId = UUID.randomUUID().toString();
                        pricipalCustome = new PricipalCustome(randomId,"ONLINE");
                        userMap.put(randomId, pricipalCustome);
                    }else{
                        //Có userID, lần đầu đăng nhập
                        if (pricipalCustome == null) {
                            System.out.println("tempPort: " + tempPort);
                            pricipalCustome = new PricipalCustome(name,"ONLINE");
                            userMap.put(name, pricipalCustome);
                        }
                    }
                    accessor.setUser(pricipalCustome);
                }
            }
        }
        return message;
    }


    public static void updatePrincipal(String oldId, PricipalCustome newPrincipal) {
        userMap.remove(oldId);
        userMap.put(newPrincipal.getName(), newPrincipal);
    }
    public static void printUserMap() {
        for (Map.Entry<String, PricipalCustome> entry : userMap.entrySet()) {
            System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue() + ", Status = " + entry.getValue().getStatus());
        }
    }

    public static void updateStatusPrincipal(String userID, String newStatus) {
        PricipalCustome principal = userMap.get(userID);
        if (principal != null) {
            principal.setStatus(newStatus);
        }
    }
    public static String getStatusByUserID(String userID) {
        String status = "OFFLINE";
        for (Map.Entry<String, PricipalCustome> entry : userMap.entrySet()) {
            if(userID.equals(entry.getKey())) {
                status = entry.getValue().getStatus();
            }
        }
        return status;
    }
    public static void removePrincipal(String userId) {
        userMap.remove(userId);
    }
}
