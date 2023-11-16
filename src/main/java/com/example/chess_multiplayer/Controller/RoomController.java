package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.LoginReponse;
import com.example.chess_multiplayer.DTO.RoomDTO;
import com.example.chess_multiplayer.Entity.Room;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Repository.RoomRepository;
import com.example.chess_multiplayer.Service.RoomService;
import com.example.chess_multiplayer.Service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import netscape.javascript.JSObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;


import java.io.IOException;
import java.security.Principal;
import java.util.*;

@Controller
public class RoomController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    private Map<String, RoomDTO> waitingRooms = new HashMap<>();

    @MessageMapping("/joinRoom")
    @SendToUser("/queue/roomJoined")
    public String joinRoom(@Payload String payload, Principal principal) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(payload);
        String userID = jsonNode.get("userID").asText();
        String roomName = jsonNode.get("roomName").asText();
//        principal.get

        if(waitingRooms.containsKey(roomName)){
            messagingTemplate.convertAndSendToUser(waitingRooms.get(roomName).getUserCreate()
                    ,"/queue/test","Vào phòng thành công cua thang tao");
            System.out.println("id thang vo" + waitingRooms.get(roomName).getUserJoin());
            System.out.println("id thang tao" + waitingRooms.get(roomName).getUserCreate());
            System.out.println("id phong" + roomName);


            waitingRooms.remove(roomName);
            System.out.println("scc" + roomName);
            return "Vào phòng thành công";
        }else {
            System.out.println("fail" + roomName);
            return "Vào phòng thất bại";
        }

    }
    @MessageMapping("/createRoom")
    @SendToUser("/queue/roomCreated")
    public String createRoom(@Payload String userID, Principal principal) {
        // Xử lý yêu cầu tạo phòng chơi
        // Tạo phòng mới và thêm người chơi vào phòng
        String roomName = generateRandomRoomName();
        System.out.println("id thang tao phong" + userID);
        System.out.println("ma phong" + roomName);
        RoomDTO room = new RoomDTO();
        room.setUserCreate(principal.getName());
        room.setUserJoin(null);
        waitingRooms.put(roomName, room);
//        RoomRepository roomRepository = roomService.createRoom();
        return roomName;
    }
    private String generateRandomRoomName() {
        int roomName;
        do {
            Random rand = new Random();
            roomName = 10000 + rand.nextInt(90000);
        } while (waitingRooms.containsKey(String.valueOf(roomName)));
        return String.valueOf(roomName);
    }


}

