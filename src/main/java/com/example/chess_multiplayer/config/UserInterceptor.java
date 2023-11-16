package com.example.chess_multiplayer.config;

import org.springframework.messaging.support.ChannelInterceptor;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
public class UserInterceptor implements ChannelInterceptor {
    private Map<String, PricipalCustome> userMap = new HashMap<>();

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            Object raw = message.getHeaders().get(SimpMessageHeaderAccessor.NATIVE_HEADERS);

            if (raw instanceof Map) {
                Object tempPort = ((Map) raw).get("tempPort");

                if (tempPort instanceof ArrayList) {
                    String name = ((ArrayList<String>) tempPort).get(0).toString();
                    PricipalCustome pricipalCustome = userMap.get(name);

                    if (pricipalCustome == null) {
                        pricipalCustome = new PricipalCustome(name);
                        userMap.put(name, pricipalCustome);
                    }

                    accessor.setUser(pricipalCustome);
                }
            }
        }
        return message;
    }
}
