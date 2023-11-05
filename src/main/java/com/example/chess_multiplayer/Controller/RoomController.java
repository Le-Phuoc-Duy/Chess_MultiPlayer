package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.Entity.Room;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Repository.RoomRepository;
import com.example.chess_multiplayer.Service.RoomService;
import com.example.chess_multiplayer.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
public class RoomController {

    @Autowired
    private RoomService roomService;

    @MessageMapping("/joinGame")
    @SendTo("/topic/joinGame")
    @Async
    public void joinGame(Principal principal) {
        //khi chon choi game

    }
    @MessageMapping("/createRoom")
    @SendTo("/topic/roomCreated")
    @Async
    public RoomRepository createRoom(Principal principal) {
        // Xử lý yêu cầu tạo phòng chơi
        // Tạo phòng mới và thêm người chơi vào phòng
        RoomRepository roomRepository = roomService.createRoom();
        return roomRepository;
    }


}

