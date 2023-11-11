package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.WaitingRoom;
import com.example.chess_multiplayer.DTO.LoginReponse;
import com.example.chess_multiplayer.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.*;

@Controller
public class RoomController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private RoomService roomService;
    private RoomuserController roomuserController = new RoomuserController();
    private Set<WaitingRoom> waitingRooms = new HashSet<>();
    private Set<String> RandomWaitingRoomIds = new HashSet<>();

    @MessageMapping("/createRoom")
    @SendToUser("/queue/roomCreated")
    public WaitingRoom createRoom(WaitingRoom message, Principal principal) {
        // Sinh ngẫu nhiên ID phòng
        String waitingRoomId = generateRandomWaitingRoomId();
//        String infor = userId + "/" + principal.getName() + "/" + mode;
        WaitingRoom waitingRoom = new WaitingRoom();
        waitingRoom.setWaitingRoomId(waitingRoomId);
        waitingRoom.setUserCreateId(message.getUserCreateId());
        waitingRoom.setSessionUserCreateId(principal.getName());
        waitingRoom.setMode(message.getMode());
        // Lưu thông tin phòng vào danh sách chờ
        waitingRooms.add(waitingRoom);
        return waitingRoom;
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
//    @SendToUser("/queue/roomJoined")
    public LoginReponse joinRoom(@Header("iDUser") String userId, WaitingRoom message, Principal principal) {
        // Kiểm tra xem phòng có tồn tại trong danh sách chờ hay không
        LoginReponse loginReponse = new LoginReponse();
        if (containsWaitingRoomById(message.getWaitingRoomId())) {
            // Phòng tồn tại, xác nhận tham gia
            WaitingRoom waitingRoom = getWaitingRoomById(message.getWaitingRoomId());

            //khoi tao room
            String idRoomCreated = roomService.createRoom(waitingRoom.getMode());
            //khoi tao roomuser
            roomuserController.creatRoomuser(waitingRoom.getUserCreateId(),idRoomCreated,waitingRoom.getMode());
            roomuserController.creatRoomuser(userId,idRoomCreated,waitingRoom.getMode());

            removeWaitingRoomById(waitingRoom.getWaitingRoomId());
            RandomWaitingRoomIds.remove(waitingRoom.getWaitingRoomId());

            loginReponse.setUserID(userId);
            loginReponse.setMessage("Vào phòng " + waitingRoom.getWaitingRoomId() + " thành công");

            messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/roomJoined", loginReponse);
            messagingTemplate.convertAndSendToUser(waitingRoom.getSessionUserCreateId(), "/queue/roomJoined", loginReponse);
            return loginReponse;
        } else {
            loginReponse.setUserID(userId);
            loginReponse.setMessage("Fail");
            return loginReponse;
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
    public boolean containsWaitingRoomById( String waitingRoomId) {
        for (WaitingRoom room : waitingRooms) {
            if (room.getWaitingRoomId().equals(waitingRoomId)) {
                return true;
            }
        }
        return false;
    }
    public WaitingRoom getWaitingRoomById( String waitingRoomId) {
        for (WaitingRoom room : waitingRooms) {
            if (room.getWaitingRoomId().equals(waitingRoomId)) {
                return room;
            }
        }
        return null;
    }
    public void removeWaitingRoomById(String waitingRoomId) {
        Iterator<WaitingRoom> iterator = waitingRooms.iterator();
        while (iterator.hasNext()) {
            WaitingRoom room = iterator.next();
            if (room.getWaitingRoomId().equals(waitingRoomId)) {
                iterator.remove();
                // Có thể thêm các xử lý khác nếu cần
            }
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

