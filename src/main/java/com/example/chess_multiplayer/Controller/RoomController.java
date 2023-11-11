package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.Entity.Room;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Repository.RoomRepository;
import com.example.chess_multiplayer.Service.RoomService;
import com.example.chess_multiplayer.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.*;

@Controller
public class RoomController {

    @Autowired
    private RoomService roomService;
    private Map<String, String> waitingRooms = new HashMap<>();
    private Set<String> RandomWaitingRoomIds = new HashSet<>();
    private RoomuserController roomuserController;
    @MessageMapping("/createRoom")
    @SendToUser("/queue/roomCreated")
    @Async
    public String createRoom(@Header("iDUser") String userId, String mode) {
        // Sinh ngẫu nhiên ID phòng
        String waitingRoomId = generateRandomWaitingRoomId();
        String infor = userId + "/" + mode;
        // Lưu thông tin phòng vào danh sách chờ
        waitingRooms.put(waitingRoomId, infor);
        return waitingRoomId;
    }

    private String generateRandomWaitingRoomId() {
        Random random = new Random();
        String waitingRoomId;
        do {
            int randomNumber = random.nextInt(900000) + 100000;
            waitingRoomId = String.valueOf(randomNumber);
        } while (!RandomWaitingRoomIds.add(waitingRoomId) || waitingRoomId.length() != 6);

        return waitingRoomId;
    }

    @MessageMapping("/joinRoom")
    @SendToUser("/queue/roomJoined")
    @Async
    public String joinRoom(@Header("iDUser") String userId, String waitingRoomId) {
        // Kiểm tra xem phòng có tồn tại trong danh sách chờ hay không
        if (waitingRooms.containsKey(waitingRoomId)) {
            // Phòng tồn tại, xác nhận tham gia
            String waitingRoomValue = waitingRooms.get(waitingRoomId);
            String[] parts = waitingRoomValue.split("/");
            String userIdCreate = parts[0];
            String mode = parts[1];

            //khoi tao room
            String idRoomCreated = roomService.createRoom(convertStringToInt(mode));
            //khoi tao roomuser
            roomuserController.creatRoomuser(userIdCreate,idRoomCreated,convertStringToInt(mode));
            roomuserController.creatRoomuser(userId,idRoomCreated,convertStringToInt(mode));

            waitingRooms.remove(waitingRoomId);
            RandomWaitingRoomIds.remove(waitingRoomId);
            return "Success";
        } else {
            return "Error";
        }
    }
    public int convertStringToInt(String input) {
        try {
            int result = Integer.parseInt(input);
            return result;
        } catch (NumberFormatException e) {
            // Xử lý trường hợp không thỏa mãn
            return 1;
        }
    }
//    @MessageMapping("/joinRoom")
//    @SendTo("/queue/roomJoined")
//    @Async
//    public CompletableFuture<String> joinRoom(@Header("iDUser") String userId, String waitingRoomId) {
//        if (waitingRooms.containsKey(waitingRoomId)) {
//            String waitingRoomValue = waitingRooms.get(waitingRoomId);
//            String[] parts = waitingRoomValue.split("/");
//            String userIdCreate = parts[0];
//            String mode = parts[1];
//
//            CompletableFuture<String> resultFuture = new CompletableFuture<>();
//
//            roomService.createRoom(convertStringToInt(mode))
//                    .thenCompose(roomIdCreated -> {
//                        CompletableFuture<Void> user1Future = roomuserService.createRoomuser(userIdCreate, roomIdCreated, convertStringToInt(mode));
//                        CompletableFuture<Void> user2Future = roomuserService.createRoomuser(userId, roomIdCreated, convertStringToInt(mode));
//
//                        // Chờ cả hai tác vụ hoàn thành
//                        return CompletableFuture.allOf(user1Future, user2Future).thenApply(ignore -> roomIdCreated);
//                    })
//                    .thenAccept(roomIdCreated -> {
//                        waitingRooms.remove(waitingRoomId);
//                        RandomWaitingRoomIds.remove(waitingRoomId);
//                        resultFuture.complete("Success");
//                    })
//                    .exceptionally(ex -> {
//                        // Xử lý lỗi
//                        ex.printStackTrace();
//                        resultFuture.complete("Error");
//                        return null;
//                    });
//
//            return resultFuture;
//        } else {
//            return CompletableFuture.completedFuture("Error");
//        }
//    }
}

