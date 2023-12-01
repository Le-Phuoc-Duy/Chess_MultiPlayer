package com.example.chess_multiplayer.Service;


import com.example.chess_multiplayer.Entity.Room;
import com.example.chess_multiplayer.Entity.Roomuser;
import com.example.chess_multiplayer.Repository.RoomRepository;
import com.example.chess_multiplayer.Repository.RoomuserRepository;
import com.example.chess_multiplayer.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.Random;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;
    public String createRoom(int mode) {
        try {
            Room room = new Room();
            room.setIDRoom(generateUniqueRandomId());
            room.setTimeStart(Instant.now());
            room.setTimeEnd(null);
            room.setMode(mode);
//            Roomuser roomuser = new Roomuser();
            room.setRoomusers(new HashSet<>());
            roomRepository.save(room);
            return room.getIDRoom();
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    private String generateUniqueRandomId() {
        Random random = new Random();
        StringBuilder idRoomBuilder;

        do {
            idRoomBuilder = new StringBuilder();
            for (int i = 0; i < 5; i++) {
                // Sử dụng ký tự từ 0-9a-zA-Z
                char randomChar = (char) (random.nextInt(62) + 48);
                idRoomBuilder.append(randomChar);
            }
        } while (roomRepository.existsById(idRoomBuilder.toString()));

        return idRoomBuilder.toString();
    }

    public boolean roomExists(String idRoom) {
        return roomRepository.existsById(idRoom);
    }

    public Room getRoomById(String idRoom) {
        return roomRepository.findById(idRoom).orElse(null);
    }
    public void updateRoomTimeEnd(String roomId) {
        Room room = roomRepository.findById(roomId).orElse(null);
        if (room != null) {
            room.setTimeEnd(Instant.now());
            roomRepository.save(room);
        }
    }

}