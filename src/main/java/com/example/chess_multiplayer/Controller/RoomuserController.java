package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.*;
import com.example.chess_multiplayer.Entity.Roomuser;
import com.example.chess_multiplayer.Enum.Result;
import com.example.chess_multiplayer.Service.RoomService;
import com.example.chess_multiplayer.Service.RoomuserService;
import com.example.chess_multiplayer.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.Optional;

@Controller
public class RoomuserController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private RoomuserService roomuserService;
    @Autowired
    private RoomService roomService;
    @Autowired
    private UserService userService;
    public String creatRoomuser(String idUser, String idRoom, int mode, boolean side){
        try{
            return roomuserService.createRoomuser(idUser,idRoom,mode,side);
        }catch (Exception e){
            return e.getMessage();
        }
    }
    @MessageMapping("/chessMove")
    public void chessMove(ChessGame message) {
        ChessGame chessGameUserReceive = new ChessGame();
        chessGameUserReceive.setiDUserSend(message.getiDUserReceive());
        chessGameUserReceive.setiDUserReceive(message.getiDUserSend());
        chessGameUserReceive.setiDRoom(message.getiDRoom());
        if(getRoomuserIdByRoomIdAndUserId(message.getiDRoom(), message.getiDUserReceive())!=null){
            chessGameUserReceive.setIdRoomUser(getRoomuserIdByRoomIdAndUserId(message.getiDRoom(), message.getiDUserReceive()));
            chessGameUserReceive.setChessMove(message.getChessMove());
            chessGameUserReceive.setBoard(reverseString(message.getBoard()));
            chessGameUserReceive.setColor(!message.getColor());
            chessGameUserReceive.setUserSendTempPort(message.getUserReceiveTempPort());
            chessGameUserReceive.setUserReceiveTempPort(message.getUserSendTempPort());
            messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/chessMove",chessGameUserReceive );
        }else{
            messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/chessMove", null);
        }
    }
    @MessageMapping("/endGame")
    public void endGame(GameStatus message) {
        System.out.println("endGame");
        GameStatus gameStatusUserReceive = new GameStatus();
        gameStatusUserReceive.setiDUserSend(message.getiDUserReceive());
        gameStatusUserReceive.setiDUserReceive(message.getiDUserSend());
        gameStatusUserReceive.setiDRoom(message.getiDRoom());
        if(getRoomuserIdByRoomIdAndUserId(message.getiDRoom(), message.getiDUserReceive())!=null){
            gameStatusUserReceive.setIdRoomUser(getRoomuserIdByRoomIdAndUserId(message.getiDRoom(), message.getiDUserReceive()));
            gameStatusUserReceive.setUserSendTempPort(message.getUserReceiveTempPort());
            gameStatusUserReceive.setUserReceiveTempPort(message.getUserSendTempPort());
            switch (message.getResult()){
                case WIN -> {
                    gameStatusUserReceive.setResult(Result.LOSE);

                    // Update user values
                    userService.updateUserWinAndElo(message.getiDUserSend()); // Increment win by 1, and elo by 50
                    userService.updateUserLoseAndElo(gameStatusUserReceive.getiDUserSend()); // Increment lose by 1, and decrement elo by 50

                    // Update room values
                    roomService.updateRoomTimeEnd(message.getiDRoom());

                    // Update room user values
                    roomuserService.updateRoomUserResult(message.getIdRoomUser(), message.getResult().toString());
                    roomuserService.updateRoomUserResult(gameStatusUserReceive.getIdRoomUser(), gameStatusUserReceive.getResult().toString());

                    messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/endGame",gameStatusUserReceive );
                    messagingTemplate.convertAndSendToUser(message.getUserSendTempPort(), "/queue/endGame",message );
                }
                case DRAW -> {
                    gameStatusUserReceive.setResult(Result.DRAW);
                    // Update user values
                    userService.updateUserDrawAndElo(message.getiDUserSend()); // Increment win by 1, and elo by 50
                    userService.updateUserDrawAndElo(gameStatusUserReceive.getiDUserSend()); // Increment lose by 1, and decrement elo by 50

                    // Update room values
                    roomService.updateRoomTimeEnd(message.getiDRoom());

                    // Update room user values
                    roomuserService.updateRoomUserResult(message.getIdRoomUser(), message.getResult().toString());
                    roomuserService.updateRoomUserResult(gameStatusUserReceive.getIdRoomUser(), gameStatusUserReceive.getResult().toString());

                    messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/endGame",gameStatusUserReceive );
                    messagingTemplate.convertAndSendToUser(message.getUserSendTempPort(), "/queue/endGame",message );
                }
                case LOSE -> {
                    gameStatusUserReceive.setResult(Result.WIN);

                    // Update user values
                    userService.updateUserLoseAndElo(message.getiDUserSend()); // Increment win by 1, and elo by 50
                    userService.updateUserWinAndElo(gameStatusUserReceive.getiDUserSend()); // Increment lose by 1, and decrement elo by 50

                    // Update room values
                    roomService.updateRoomTimeEnd(message.getiDRoom());

                    // Update room user values
                    roomuserService.updateRoomUserResult(message.getIdRoomUser(), message.getResult().toString());
                    roomuserService.updateRoomUserResult(gameStatusUserReceive.getIdRoomUser(), gameStatusUserReceive.getResult().toString());

                    messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/endGame",gameStatusUserReceive );
                    messagingTemplate.convertAndSendToUser(message.getUserSendTempPort(), "/queue/endGame",message );

                }
                case DRAW_REQUEST -> {
                    gameStatusUserReceive.setResult(Result.DRAW_REQUEST);
                    messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/endGame",gameStatusUserReceive );
                }
                case DRAW_ACCEPT -> {
                    message.setResult(Result.DRAW);
                    gameStatusUserReceive.setResult(Result.DRAW);

                    // Update user values
                    userService.updateUserDrawAndElo(message.getiDUserSend()); // Increment win by 1, and elo by 50
                    userService.updateUserDrawAndElo(gameStatusUserReceive.getiDUserSend()); // Increment lose by 1, and decrement elo by 50

                    // Update room values
                    roomService.updateRoomTimeEnd(message.getiDRoom());

                    // Update room user values
                    roomuserService.updateRoomUserResult(message.getIdRoomUser(), message.getResult().toString());
                    roomuserService.updateRoomUserResult(gameStatusUserReceive.getIdRoomUser(), gameStatusUserReceive.getResult().toString());

                    gameStatusUserReceive.setResult(Result.DRAW_ACCEPT);
                    messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/endGame",gameStatusUserReceive );
                    messagingTemplate.convertAndSendToUser(message.getUserSendTempPort(), "/queue/endGame",message );
                }
                case DRAW_DENY -> {
                    gameStatusUserReceive.setResult(Result.DRAW_DENY);
                    messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/endGame",gameStatusUserReceive );
                }
                case QUIT -> {
                    message.setResult(Result.LOSE);
                    gameStatusUserReceive.setResult(Result.WIN);

                    // Update user values
                    userService.updateUserLoseAndElo(message.getiDUserSend()); // Increment win by 1, and elo by 50
                    userService.updateUserWinAndElo(gameStatusUserReceive.getiDUserSend()); // Increment lose by 1, and decrement elo by 50

                    // Update room values
                    roomService.updateRoomTimeEnd(message.getiDRoom());

                    // Update room user values
                    roomuserService.updateRoomUserResult(message.getIdRoomUser(), message.getResult().toString());
                    roomuserService.updateRoomUserResult(gameStatusUserReceive.getIdRoomUser(), gameStatusUserReceive.getResult().toString());

                    gameStatusUserReceive.setResult(Result.QUIT);
                    messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/endGame",gameStatusUserReceive );
                }
                case SURRENDER -> {
                    message.setResult(Result.LOSE);
                    gameStatusUserReceive.setResult(Result.WIN);

                    // Update user values
                    userService.updateUserLoseAndElo(message.getiDUserSend()); // Increment win by 1, and elo by 50
                    userService.updateUserWinAndElo(gameStatusUserReceive.getiDUserSend()); // Increment lose by 1, and decrement elo by 50

                    // Update room values
                    roomService.updateRoomTimeEnd(message.getiDRoom());

                    // Update room user values
                    roomuserService.updateRoomUserResult(message.getIdRoomUser(), message.getResult().toString());
                    roomuserService.updateRoomUserResult(gameStatusUserReceive.getIdRoomUser(), gameStatusUserReceive.getResult().toString());

                    gameStatusUserReceive.setResult(Result.SURRENDER);
                    messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/endGame",gameStatusUserReceive );
                    messagingTemplate.convertAndSendToUser(message.getUserSendTempPort(), "/queue/endGame",message );
                }
                default -> {
                    gameStatusUserReceive.setResult(Result.ACTIVE);
                }
            }
        }else{
            messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/endGame", null);
        }

    }
    @MessageMapping("/chatRoom")
    public void chatRoom(ChatRoom message) {
        roomuserService.updateChatById(message.getIdRoomUser(),message.getChat());
        ChatRoom chatRoomUserReceive = new ChatRoom();
        chatRoomUserReceive.setIdUserSend(message.getIdUserReceive());
        chatRoomUserReceive.setUserSendName(userService.getUsernameByUserID(message.getIdUserSend()));
        chatRoomUserReceive.setUserSendAva(userService.getUserById(message.getIdUserSend()).getAva());
        chatRoomUserReceive.setIdUserReceive(message.getIdUserSend());
        chatRoomUserReceive.setIdRoom(message.getIdRoom());
        if(getRoomuserIdByRoomIdAndUserId(message.getIdRoom(), message.getIdUserReceive())!=null){
            chatRoomUserReceive.setIdRoomUser(getRoomuserIdByRoomIdAndUserId(message.getIdRoom(), message.getIdUserReceive()));
            chatRoomUserReceive.setChat(message.getChat());
            chatRoomUserReceive.setUserSendTempPort(message.getUserReceiveTempPort());
            chatRoomUserReceive.setUserReceiveTempPort(message.getUserSendTempPort());
            messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/chatRoom",chatRoomUserReceive );
        }else{
            messagingTemplate.convertAndSendToUser(message.getUserReceiveTempPort(), "/queue/chatRoom", null);
        }
    }
    public String reverseString(String inputString) {
        // Chuyển inputString thành mảng ký tự để thực hiện việc đảo ngược
        char[] charArray = inputString.toCharArray();

        // Đảo ngược mảng ký tự
        int left = 0;
        int right = charArray.length - 1;
        while (left < right) {
            // Swap ký tự ở vị trí left và right
            char temp = charArray[left];
            charArray[left] = charArray[right];
            charArray[right] = temp;

            left++;
            right--;
        }

        // Chuyển mảng ký tự đã đảo ngược về chuỗi
        return new String(charArray);
    }
    public String getRoomuserIdByRoomIdAndUserId(String idRoom, String idUser) {
        Optional<Roomuser> roomuserOptional = roomuserService.findRoomuserByRoomIdAndUserId(idRoom, idUser);

        if (roomuserOptional.isPresent()) {
            Roomuser roomuser = roomuserOptional.get();
            return roomuser.getIDRoomUser();
        } else {
            return null;
        }
    }
}