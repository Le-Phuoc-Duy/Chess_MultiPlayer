package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.*;
import com.example.chess_multiplayer.Service.AccountService;
import com.example.chess_multiplayer.Service.RoomService;
import com.example.chess_multiplayer.Service.UserService;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Entity.Account;

import com.example.chess_multiplayer.config.UserInterceptor;
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

        //khoi tao roomuser
        boolean color = generateRandomBoolean();
        String idRoomUser1Created;
        String idRoomUser2Created;
        if(color){
            idRoomUser1Created = roomuserController.creatRoomuser(user.getIdUserCreate(),idRoomCreated,user.getMode(), true);
            idRoomUser2Created = roomuserController.creatRoomuser(message.getIdUserCreate(),idRoomCreated,message.getMode(),false);
        }else{
            idRoomUser1Created = roomuserController.creatRoomuser(user.getIdUserCreate(),idRoomCreated,user.getMode(), false);
            idRoomUser2Created = roomuserController.creatRoomuser(message.getIdUserCreate(),idRoomCreated,message.getMode(),true);
        }
        //set Chess Game
        switch (user.getMode()){
            case -1 -> {
                chessGameUser1.setUserCountdownValue(120);
                chessGameUser2.setUserCountdownValue(120);
            }
            case -2 -> {
                chessGameUser1.setUserCountdownValue(180);
                chessGameUser2.setUserCountdownValue(180);
            }
            case -3 -> {
                chessGameUser1.setUserCountdownValue(300);
                chessGameUser2.setUserCountdownValue(300);
            }
            case -4 -> {
                chessGameUser1.setUserCountdownValue(600);
                chessGameUser2.setUserCountdownValue(600);
            }
            default ->{
                chessGameUser1.setUserCountdownValue(user.getMode());
                chessGameUser2.setUserCountdownValue(user.getMode());
            }
        }

        chessGameUser1.setiDUserSend(user.getIdUserCreate());
        chessGameUser1.setiDRoom(idRoomCreated);
        chessGameUser1.setIdRoomUser(idRoomUser1Created);
        chessGameUser1.setChessMove(null);
//        chessGameUser1.setUserSendName(userService.getUsernameByUserID(user.getIdUserCreate()));
        chessGameUser1.setUserName(userService.getUsernameByUserID(user.getIdUserCreate()));
        chessGameUser1.setUserSendAva(userService.getUserById(message.getIdUserCreate()).getAva());
        chessGameUser1.setUserReceiveName(userService.getUsernameByUserID(message.getIdUserCreate()));

        chessGameUser2.setiDUserSend(message.getIdUserCreate());
        chessGameUser2.setiDRoom(idRoomCreated);
        chessGameUser2.setIdRoomUser(idRoomUser2Created);
        chessGameUser2.setChessMove(null);
//        chessGameUser2.setUserSendName(userService.getUsernameByUserID(message.getIdUserCreate()));
        chessGameUser2.setUserName(userService.getUsernameByUserID(message.getIdUserCreate()));
        chessGameUser2.setUserSendAva(userService.getUserById(user.getIdUserCreate()).getAva());
        chessGameUser2.setUserReceiveName(userService.getUsernameByUserID(user.getIdUserCreate()));

        if(color){
            chessGameUser1.setColor(color);
            chessGameUser2.setColor(!color);
            chessGameUser1.setBoard("rnbqkbnrpppppppp////////////////////////////////PPPPPPPPRNBQKBNR");
            chessGameUser2.setBoard("RNBQKBNRPPPPPPPP////////////////////////////////pppppppprnbqkbnr");
            UserInterceptor.changeRoom("INCREASE",idRoomCreated,chessGameUser1.getiDUserSend(),chessGameUser2.getiDUserSend(),"Đang chơi");
        }else{
            chessGameUser1.setColor(color);
            chessGameUser2.setColor(!color);
            chessGameUser2.setBoard("rnbqkbnrpppppppp////////////////////////////////PPPPPPPPRNBQKBNR");
            chessGameUser1.setBoard("RNBQKBNRPPPPPPPP////////////////////////////////pppppppprnbqkbnr");
            UserInterceptor.changeRoom("INCREASE",idRoomCreated,chessGameUser2.getiDUserSend(),chessGameUser1.getiDUserSend(),"Đang chơi");

        }
        UserInterceptor.updateStatusPrincipal(message.getIdUserCreate(),"INGAME");
        UserInterceptor.updateStatusPrincipal(user.getIdUserCreate(),"INGAME");
        //send result to user2-user1
        messagingTemplate.convertAndSendToUser(message.getIdUserCreate(), "/queue/createGameRoom", chessGameUser2);
        messagingTemplate.convertAndSendToUser(user.getIdUserCreate(), "/queue/createGameRoom", chessGameUser1);
    }

    @MessageMapping("/cancelJoinGame")
    public void cancelJoinGame(queueUser message) {
        for (queueUser user: queueUsers){
        }
        Iterator<queueUser> iterator = queueUsers.iterator();
        while (iterator.hasNext()) {
            queueUser user = iterator.next();
            if (user.getIdUserCreate().equals(message.getIdUserCreate())) {
                queueUsers.remove(user); // Loại bỏ người chơi khớp từ danh sách chờ
                break;
            }
        }
        for (queueUser user: queueUsers){
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
