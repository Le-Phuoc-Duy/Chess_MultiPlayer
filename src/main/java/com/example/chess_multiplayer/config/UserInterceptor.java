package com.example.chess_multiplayer.config;

import com.example.chess_multiplayer.Server.ServerApplication;
import org.springframework.messaging.support.ChannelInterceptor;

import java.util.*;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
public class UserInterceptor implements ChannelInterceptor {
    private static Map<String, PricipalCustomer> userMap = new HashMap<>();
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            Object raw = message.getHeaders().get(SimpMessageHeaderAccessor.NATIVE_HEADERS);

            if (raw instanceof Map) {
                Object userID = ((Map) raw).get("userID");

                if (userID instanceof ArrayList) {
                    String name = ((ArrayList<String>) userID).get(0).toString();
                    PricipalCustomer pricipalCustomer = userMap.get(name);
                    //userID null, trước khi vào chức năng login
                    if ("null".equals(name)){
                        final String randomId = UUID.randomUUID().toString();
                        pricipalCustomer = new PricipalCustomer(randomId,"ONLINE");
                        changeOnline("INCREASE",randomId);
                        userMap.put(randomId, pricipalCustomer);
                    }else{
                        //Có userID, lần đầu đăng nhập
                        if (pricipalCustomer == null) {
                            pricipalCustomer = new PricipalCustomer(name,"ONLINE");
                            changeOnline("INCREASE",name);
                            userMap.put(name, pricipalCustomer);
                        }
                    }
                    accessor.setUser(pricipalCustomer);
                }
            }
        }
        return message;
    }


    public static void updatePrincipal(String oldId, PricipalCustomer newPrincipal) {
        userMap.remove(oldId);
        userMap.put(newPrincipal.getName(), newPrincipal);
    }

    public static void updateStatusPrincipal(String userID, String newStatus) {
        PricipalCustomer principal = userMap.get(userID);
        if (principal != null) {
            principal.setStatus(newStatus);
        }
    }
    public static String getStatusByUserID(String userID) {
        String status = "OFFLINE";
        for (Map.Entry<String, PricipalCustomer> entry : userMap.entrySet()) {
            if(userID.equals(entry.getKey())) {
                status = entry.getValue().getStatus();
            }
        }
        return status;
    }
    public static void removePrincipal(String userId) {
        userMap.remove(userId);
    }
    public static void changeOnline(String opt, String newUserID){
        ServerApplication.changeOnline(opt, newUserID);
    }
    public static void changeRoom(String opt, String roomID ,String blackID, String whiteID, String result){
        ServerApplication.changeRoom(opt, roomID, blackID, whiteID, result);
    }
}
