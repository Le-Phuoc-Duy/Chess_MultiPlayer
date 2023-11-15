package com.example.chess_multiplayer.Service;

import com.example.chess_multiplayer.Entity.Room;
import com.example.chess_multiplayer.Entity.Roomuser;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Repository.RoomRepository;
import com.example.chess_multiplayer.Repository.RoomuserRepository;
import com.example.chess_multiplayer.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@Service
public class RoomuserService {
    @Autowired
    private RoomuserRepository roomuserRepository;

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserService userService;
    @Autowired
    private AccountService accountService;
    public String createRoomuser(String idAcc, String idRoom, int mode,boolean side){
        try{
            Roomuser roomUser = new Roomuser();
            roomUser.setIDRoomUser(generateUniqueRandomId());
            roomUser.setUser(userService.getUserById(accountService.getUserIDbyAccountID(idAcc)));
            roomUser.setChat(null);
            roomUser.setResult(null);
            roomUser.setSide(side);
            Room room;
            if (idRoom != null && roomService.roomExists(idRoom)) {
                room = roomService.getRoomById(idRoom);
            } else {
                // Nếu không, tạo một Room mới
                String idRoomPeriod = roomService.createRoom(mode);
                room = roomService.getRoomById(idRoomPeriod);
            }
            roomUser.setRoom(room);
            roomuserRepository.save(roomUser);
            room.getRoomusers().add(roomUser);
            return "Create Success";
        }catch (Exception e){
            e.printStackTrace();
            return e.getMessage();
        }
    }
    private String generateUniqueRandomId() {
        Random random = new Random();
        StringBuilder idRoomuserBuilder;

        do {
            idRoomuserBuilder = new StringBuilder();
            for (int i = 0; i < 5; i++) {
                // Sử dụng ký tự từ 0-9a-zA-Z
                char randomChar = (char) (random.nextInt(62) + 48);
                idRoomuserBuilder.append(randomChar);
            }
        } while (roomuserRepository.existsById(idRoomuserBuilder.toString()));

        return idRoomuserBuilder.toString();
    }
}
