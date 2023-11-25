package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.*;
import com.example.chess_multiplayer.Service.AccountService;
import com.example.chess_multiplayer.Service.RoomService;
import com.example.chess_multiplayer.Service.UserService;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Entity.Account;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.*;

@Controller
public class UserController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private UserService userService;
    @Autowired
    private RoomService roomService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private RoomuserController roomuserController;
    private Set<queueUser> queueUsers = new HashSet<>();
    public String getIdUserByIDAcc(String idAcc){
        return userService.getIdUserByIdAcc(idAcc);
    }
    @MessageMapping("/publicChat")
    @SendTo("/topic/publicChat")
    public publicChat publicChat(publicChat message) {
        if(userService.getUserById(message.getIdDUserSend())!=null){
            message.setUserSendName(userService.getUsernameByUserID(message.getIdDUserSend()));
            message.setAva(userService.getUserById(message.getIdDUserSend()).getAva());
            return message;

        }else{
            return null;
        }
    }

    @MessageMapping("/joinGame")
    public void joinGame(queueUser message) {
        queueUsers.add(message);
        Iterator<queueUser> iterator = queueUsers.iterator();
        while (queueUsers.contains(message)) {
            while (iterator.hasNext()) {
                queueUser user = iterator.next();
                if (user.getMode() == message.getMode() && !user.getIdUserCreate().equals(message.getIdUserCreate())) {
                    queueUsers.remove(message);
                    createGameRoom(user, message); // Tạo phòng chơi với hai người chơi phù hợp
                    queueUsers.remove(user); // Loại bỏ người chơi khớp từ danh sách chờ
                    return;
                }
            }
        }
    }

    private void createGameRoom(queueUser user, queueUser message) {
        ChessGame chessGameUser1 = new ChessGame();
        ChessGame chessGameUser2 = new ChessGame();
        //khoi tao room
        String idRoomCreated = roomService.createRoom(user.getMode());
        System.out.println("iduser1" + user.getIdUserCreate());
        System.out.println("iduser2" + message.getIdUserCreate());
        System.out.println("idRoomCreated: " + idRoomCreated);

        //khoi tao roomuser
        boolean color = generateRandomBoolean();
        String idRoomUser1Created;
        String idRoomUser2Created;
        if(color){
            idRoomUser1Created = roomuserController.creatRoomuser(user.getIdUserCreate(),idRoomCreated,user.getMode(), true);
            System.out.println("createRoomUser1" + idRoomUser1Created);
            idRoomUser2Created = roomuserController.creatRoomuser(message.getIdUserCreate(),idRoomCreated,message.getMode(),false);
            System.out.println("createRoomUser2" + idRoomUser2Created);
        }else{
            idRoomUser1Created = roomuserController.creatRoomuser(user.getIdUserCreate(),idRoomCreated,user.getMode(), false);
            System.out.println("createRoomUser1" + idRoomUser1Created);
            idRoomUser2Created = roomuserController.creatRoomuser(message.getIdUserCreate(),idRoomCreated,message.getMode(),true);
            System.out.println("createRoomUser2" + idRoomUser2Created);
        }
        //set Chess Game
        chessGameUser1.setiDUserSend(user.getIdUserCreate());
        chessGameUser1.setiDUserReceive(message.getIdUserCreate());
        chessGameUser1.setiDRoom(idRoomCreated);
        chessGameUser1.setIdRoomUser(idRoomUser1Created);
        chessGameUser1.setChessMove(null);
        chessGameUser1.setUserSendTempPort(user.getUserCreateTempPort());
        chessGameUser1.setUserReceiveTempPort(message.getUserCreateTempPort());

        chessGameUser2.setiDUserSend(message.getIdUserCreate());
        chessGameUser2.setiDUserReceive(user.getIdUserCreate());
        chessGameUser2.setiDRoom(idRoomCreated);
        chessGameUser2.setIdRoomUser(idRoomUser2Created);
        chessGameUser2.setChessMove(null);
        chessGameUser2.setUserSendTempPort(message.getUserCreateTempPort());
        chessGameUser2.setUserReceiveTempPort(user.getUserCreateTempPort());
        if(color){
            chessGameUser1.setColor(color);
            chessGameUser2.setColor(!color);
            chessGameUser1.setBoard("rnbqkbnrpppppppp////////////////////////////////PPPPPPPPRNBQKBNR");
            chessGameUser2.setBoard("RNBQKBNRPPPPPPPP////////////////////////////////pppppppprnbqkbnr");
        }else{
            chessGameUser1.setColor(color);
            chessGameUser2.setColor(!color);
            chessGameUser2.setBoard("rnbqkbnrpppppppp////////////////////////////////PPPPPPPPRNBQKBNR");
            chessGameUser1.setBoard("RNBQKBNRPPPPPPPP////////////////////////////////pppppppprnbqkbnr");
        }
        System.out.println(chessGameUser1.toString());
        System.out.println(chessGameUser2.toString());
        //send result to user2-user1
        messagingTemplate.convertAndSendToUser(message.getUserCreateTempPort(), "/queue/createGameRoom", chessGameUser2);
        messagingTemplate.convertAndSendToUser(user.getUserCreateTempPort(), "/queue/createGameRoom", chessGameUser1);
    }

    @MessageMapping("/cancelJoinGame")
    public void cancelJoinGame(queueUser message) {
        System.out.println("before Cancel: ");
        for (queueUser user: queueUsers){
            System.out.println(user.getIdUserCreate());
        }
        System.out.println("call Cancel: " + message.getIdUserCreate());
        Iterator<queueUser> iterator = queueUsers.iterator();
        while (iterator.hasNext()) {
            queueUser user = iterator.next();
            if (user.getIdUserCreate().equals(message.getIdUserCreate())) {
                System.out.println("remove: " + user.getIdUserCreate());
                queueUsers.remove(user); // Loại bỏ người chơi khớp từ danh sách chờ
                break;
            }
        }
        System.out.println("after Cancel: ");
        for (queueUser user: queueUsers){
           System.out.println(user.getIdUserCreate());
        }
    }
    public boolean generateRandomBoolean() {
        Random random = new Random();
        return random.nextBoolean();
    }


    public String registerUser(String username, String password, int ava) {
        return userService.registerUser(username, password, ava);

    }
}
