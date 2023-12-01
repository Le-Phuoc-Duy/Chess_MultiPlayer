package com.example.chess_multiplayer.Service;

import com.example.chess_multiplayer.Entity.Room;
import com.example.chess_multiplayer.Entity.Roomuser;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Repository.RoomRepository;
import com.example.chess_multiplayer.Repository.RoomuserRepository;
import com.example.chess_multiplayer.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.Optional;
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
    private UserRepository userRepository;
    @Autowired
    private RoomRepository roomRepository;
    public String createRoomuser(String idUser, String idRoom, int mode,boolean side){
        try{
            Roomuser roomUser = new Roomuser();
            roomUser.setIDRoomUser(generateUniqueRandomId());
            roomUser.setUser(userService.getUserById(idUser));
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
//            room.getRoomusers().add(roomUser);
            return roomUser.getIDRoomUser();
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
    public Optional<Roomuser> findRoomuserByRoomIdAndUserId(String idRoom, String idUser) {
        User user = userRepository.findById(idUser).orElse(null);
        Room room = roomRepository.findById(idRoom).orElse(null);
        if(user != null && room != null){
            return roomuserRepository.findByUserAndRoom(user,room);
        }
        return null;
    }
    public void updateChatById(String idRoomUser, String chat) {
        roomuserRepository.findById(idRoomUser).ifPresent(roomuser -> {
            if(roomuser.getChat() != null){
                roomuser.setChat(roomuser.getChat() + "@" + chat + "@" + Instant.now().toString());
                roomuserRepository.save(roomuser);
            }else{
                roomuser.setChat("@" + chat + "@" + Instant.now().toString());
                roomuserRepository.save(roomuser);
            }
        });
    }
    public Roomuser getRoomUserById(String idRoomUser) {
        return roomuserRepository.findById(idRoomUser).orElse(null);
    }
    public void updateRoomUserResult(String roomUserId, String result) {
        Roomuser roomUser = roomuserRepository.findById(roomUserId).orElse(null);
        if (roomUser != null) {
            roomUser.setResult(result);
            roomuserRepository.save(roomUser);
        }
    }
}