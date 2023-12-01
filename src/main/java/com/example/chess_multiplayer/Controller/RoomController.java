package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.ChessGame;
import com.example.chess_multiplayer.DTO.JoinRoom;
import com.example.chess_multiplayer.DTO.WaitingRoom;
import com.example.chess_multiplayer.DTO.LoginReponse;
import com.example.chess_multiplayer.Service.AccountService;
import com.example.chess_multiplayer.Service.RoomService;
import com.example.chess_multiplayer.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.*;

@Controller
public class RoomController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private RoomService roomService;
    @Autowired
    private UserService userService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private RoomuserController roomuserController;
    private Set<WaitingRoom> waitingRooms = new HashSet<>();
    private Set<String> RandomWaitingRoomIds = new HashSet<>();

    @MessageMapping("/createRoom")
    @SendToUser("/queue/roomCreated")
    public WaitingRoom createRoom(WaitingRoom message) {
        // Sinh ngẫu nhiên ID phòng
        String waitingRoomId = generateRandomWaitingRoomId();
//        String infor = userId + "/" + principal.getName() + "/" + mode;
        WaitingRoom waitingRoom = new WaitingRoom();
        waitingRoom.setWaitingRoomId(waitingRoomId);
        waitingRoom.setUserCreateId(message.getUserCreateId());
        waitingRoom.setMode(message.getMode());
        waitingRoom.setTempPort(message.getTempPort());
        // Lưu thông tin phòng vào danh sách chờ
        waitingRooms.add(waitingRoom);
        System.out.println(waitingRoom.toString());
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
    public void joinRoom(JoinRoom message) {
        // Kiểm tra xem phòng có tồn tại trong danh sách chờ hay không
        if (containsWaitingRoomById(message.getWaitingRoomId())) {
            // Phòng tồn tại, xác nhận tham gia
            ChessGame chessGameUser1 = new ChessGame();
            ChessGame chessGameUser2 = new ChessGame();
            WaitingRoom waitingRoom = getWaitingRoomById(message.getWaitingRoomId());

            //khoi tao room
            String idRoomCreated = roomService.createRoom(waitingRoom.getMode());
            System.out.println("iduser1" + waitingRoom.getUserCreateId());
            System.out.println("iduser2" + message.getIdUserJoin());
            System.out.println("idRoomCreated: " + idRoomCreated);

            //khoi tao roomuser
            boolean color = generateRandomBoolean();
            String idRoomUser1Created;
            String idRoomUser2Created;
            if(color == true){
                idRoomUser1Created = roomuserController.creatRoomuser(waitingRoom.getUserCreateId(),idRoomCreated,waitingRoom.getMode(), true);
                System.out.println("createRoomUser1" + idRoomUser1Created);
                idRoomUser2Created = roomuserController.creatRoomuser(message.getIdUserJoin(),idRoomCreated,waitingRoom.getMode(),false);
                System.out.println("createRoomUser2" + idRoomUser2Created);
            }else{
                idRoomUser1Created = roomuserController.creatRoomuser(waitingRoom.getUserCreateId(),idRoomCreated,waitingRoom.getMode(), false);
                System.out.println("createRoomUser1" + idRoomUser1Created);
                idRoomUser2Created = roomuserController.creatRoomuser(message.getIdUserJoin(),idRoomCreated,waitingRoom.getMode(),true);
                System.out.println("createRoomUser2" + idRoomUser2Created);
            }
            //remove hang doi
            removeWaitingRoomById(waitingRoom.getWaitingRoomId());
            RandomWaitingRoomIds.remove(waitingRoom.getWaitingRoomId());
            //set Chess Game
            chessGameUser1.setiDUserSend(waitingRoom.getUserCreateId());
            chessGameUser1.setiDUserReceive(message.getIdUserJoin());
            chessGameUser1.setiDRoom(idRoomCreated);
            chessGameUser1.setIdRoomUser(idRoomUser1Created);
            chessGameUser1.setChessMove(null);
            chessGameUser1.setUserSendTempPort(waitingRoom.getTempPort());
            chessGameUser1.setUserReceiveTempPort(message.getTempPort());
            chessGameUser1.setUserSendName(userService.getUsernameByUserID(message.getIdUserJoin()));
            chessGameUser1.setUserSendAva(userService.getUserById(message.getIdUserJoin()).getAva());

            chessGameUser2.setiDUserSend(message.getIdUserJoin());
            chessGameUser2.setiDUserReceive(waitingRoom.getUserCreateId());
            chessGameUser2.setiDRoom(idRoomCreated);
            chessGameUser2.setIdRoomUser(idRoomUser2Created);
            chessGameUser2.setChessMove(null);
            chessGameUser2.setUserSendTempPort(message.getTempPort());
            chessGameUser2.setUserReceiveTempPort(waitingRoom.getTempPort());
            chessGameUser2.setUserSendName(userService.getUsernameByUserID(waitingRoom.getUserCreateId()));
            chessGameUser2.setUserSendAva(userService.getUserById(waitingRoom.getUserCreateId()).getAva());
            if(color == true){
                chessGameUser1.setColor(color);
                chessGameUser2.setColor(!color);
                chessGameUser1.setBoard("rnbqkbnrpppppppp////////////////////////////////PPPPPPPPRNBQKBNR");
                chessGameUser2.setBoard("RNBKQBNRPPPPPPPP////////////////////////////////pppppppprnbkqbnr");
            }else{
                chessGameUser1.setColor(color);
                chessGameUser2.setColor(!color);
                chessGameUser2.setBoard("rnbqkbnrpppppppp////////////////////////////////PPPPPPPPRNBQKBNR");
                chessGameUser1.setBoard("RNBKQBNRPPPPPPPP////////////////////////////////pppppppprnbkqbnr");
            }
            System.out.println(chessGameUser1.toString());
            System.out.println(chessGameUser2.toString());
            //send result to user2-user1
            messagingTemplate.convertAndSendToUser(message.getTempPort(), "/queue/roomJoined", chessGameUser2);
            messagingTemplate.convertAndSendToUser(waitingRoom.getTempPort(), "/queue/roomJoined", chessGameUser1);
        } else {
            LoginReponse loginReponse = new LoginReponse();
            loginReponse.setUserID(message.getIdUserJoin());
            loginReponse.setMessage("Mã phòng không hợp lệ! ");
            messagingTemplate.convertAndSendToUser(message.getTempPort(), "/queue/roomJoined", loginReponse);
        }
    }
    public boolean generateRandomBoolean() {
        Random random = new Random();
        return random.nextBoolean();
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
}