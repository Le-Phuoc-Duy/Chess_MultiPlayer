package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.*;
import com.example.chess_multiplayer.Entity.Roomuser;
import com.example.chess_multiplayer.Enum.Result;
import com.example.chess_multiplayer.Service.AccountService;
import com.example.chess_multiplayer.Interface.CountdownTimerListener;
import com.example.chess_multiplayer.Service.RoomService;
import com.example.chess_multiplayer.Service.RoomuserService;
import com.example.chess_multiplayer.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.*;

@Controller
public class RoomuserController implements CountdownTimerListener {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private RoomuserService roomuserService;
    @Autowired
    private RoomService roomService;
    @Autowired
    private UserService userService;
    @Autowired
    private AccountService accountService;
    private final Set<CountdownTimer> countdownTimers = new HashSet<>();
    @Override
    public void onTimerFinish(String userSendTempPort, String userReceiveTempPort, String idRoomUser, String idRoomUserReceive, String idRoom, String idUserSend, String idUserReceive) {
        TimeOut timeOutUserSend = new TimeOut("Time out", userSendTempPort);
        TimeOut timeOutUserReviece = new TimeOut("Opponent Time out", userReceiveTempPort);
        messagingTemplate.convertAndSendToUser(timeOutUserSend.getUserTempPort(), "/queue/timeout", timeOutUserSend);
        messagingTemplate.convertAndSendToUser(timeOutUserReviece.getUserTempPort(), "/queue/timeout", timeOutUserReviece);
        checkAndRemoveFinishedTimersUserSendTempPort(userReceiveTempPort);

        // Update user values
        userService.updateUserLoseAndElo(idUserSend); // Increment win by 1, and elo by 50
        userService.updateUserWinAndElo(idUserReceive); // Increment lose by 1, and decrement elo by 50

        // Update room values
        roomService.updateRoomTimeEnd(idRoom);

        // Update room user values
        roomuserService.updateRoomUserResult(idRoomUser, Result.LOSE.toString());
        roomuserService.updateRoomUserResult(idRoomUserReceive, Result.WIN.toString());
        System.out.println("Time out for user: " + userSendTempPort);
    }

    @Override
    public void countdown(String userSendTempPort, String userReceiveTempPort, int countdownValue) {
        CountdownTimer countdownTimer = new CountdownTimer(countdownValue, userSendTempPort,userReceiveTempPort);
        messagingTemplate.convertAndSendToUser(countdownTimer.getUserSendTempPort(), "/queue/countdown", countdownTimer);
        messagingTemplate.convertAndSendToUser(countdownTimer.getUserReceiveTempPort(), "/queue/countdown", countdownTimer);
    }

    public void checkAndRemoveFinishedTimersUserSendTempPort(String userSendTempPort) {
        Iterator<CountdownTimer> iterator = countdownTimers.iterator();
        while (iterator.hasNext()) {
            CountdownTimer timer = iterator.next();
            if (timer.getUserSendTempPort().equals(userSendTempPort)) {
                timer.stopCountdown();
                iterator.remove();
            }
        }
    }
    public void stopCountdownTimerWithIdRoomUser(String idRoomUser, int extra) {
        for (CountdownTimer timer : countdownTimers) {
            if (timer.getIdRoomUser().equals(idRoomUser)) {
                timer.addSeconds(extra);
                timer.setShouldDecreaseValue(false);
                break;
            }
        }
    }
    public int getCountdownTimerWithIdRoomUser(String idRoomUser) {
        for (CountdownTimer timer : countdownTimers) {
            if (timer.getIdRoomUser().equals(idRoomUser)) {
                return timer.getCountdownValue();
            }
        }
        return -1;
    }
    public void startCountdownTimerWithIdRoomUser(String idRoomUser) {
        for (CountdownTimer timer : countdownTimers) {
            if (timer.getIdRoomUser().equals(idRoomUser)) {
                timer.setShouldDecreaseValue(true);
                break;
            }
        }
    }
    public void createCountdownTimer(int countdownValue, String idRoomUser, boolean shouldDecreaseValue, String userSendTempPort, String userReceiveTempPort, String idRoomUserReceive, String idRoom, String idUserSend, String idUserReceive) {
        CountdownTimer timer = new CountdownTimer(countdownValue, idRoomUser, this,shouldDecreaseValue, userSendTempPort, userReceiveTempPort, idRoomUserReceive, idRoom, idUserSend, idUserReceive);
        checkAndRemoveFinishedTimers();
        timer.startCountdown();
        countdownTimers.add(timer);
    }
    public void checkAndRemoveFinishedTimers() {
        Iterator<CountdownTimer> iterator = countdownTimers.iterator();
        while (iterator.hasNext()) {
            CountdownTimer timer = iterator.next();
            if (timer.isFinished()) {
                timer.stopCountdown();
                iterator.remove();
            }
        }
    }
    public void checkAndRemoveFinishedTimersRoomUser(String IdRoomUser) {
        Iterator<CountdownTimer> iterator = countdownTimers.iterator();
        while (iterator.hasNext()) {
            CountdownTimer timer = iterator.next();
            if (timer.getIdRoomUser().equals(IdRoomUser)) {
                timer.stopCountdown();
                iterator.remove();
            }
        }
    }
    public String creatRoomuser(String idUser, String idRoom, int mode, boolean side){
        try{
            return roomuserService.createRoomuser(idUser,idRoom,mode,side);
        }catch (Exception e){
            return e.getMessage();
        }
    }
    public boolean containsCountdownTimerWithIdUser(String idUser) {
        for (CountdownTimer timer : countdownTimers) {
            if (timer.getIdRoomUser().equals(idUser)) {
                return true;
            }
        }
        return false;
    }
    @MessageMapping("/chessMove")
    public void chessMove(ChessGame message) {
        String AccId = accountService.getAccID(message.getUserSendName());
        String UserId = userService.getIdUserByIdAcc(AccId);
        String AccOppId = accountService.getAccID(message.getUserReceiveName());
        String UserOppId = userService.getIdUserByIdAcc(AccOppId);
        int mode = roomService.getRoomById(message.getiDRoom()).getMode();
        System.out.println("mode: "+ mode);
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
            if(containsCountdownTimerWithIdUser(message.getIdRoomUser()) && containsCountdownTimerWithIdUser(chessGameUserReceive.getIdRoomUser())){
                switch (mode){
                    case -1 -> {
                        stopCountdownTimerWithIdRoomUser(message.getIdRoomUser(), 2);
                    }
                    case -2 -> {
                        stopCountdownTimerWithIdRoomUser(message.getIdRoomUser(), 3);
                    }
                    default -> {
                        stopCountdownTimerWithIdRoomUser(message.getIdRoomUser(), 1);
                    }
                }
                startCountdownTimerWithIdRoomUser(chessGameUserReceive.getIdRoomUser());
            }else{
                switch (mode){
                    case -1 -> {
                        createCountdownTimer(120, message.getIdRoomUser(),false, message.getUserSendTempPort(), message.getUserReceiveTempPort(), chessGameUserReceive.getIdRoomUser(), message.getiDRoom(), message.getiDUserSend(), message.getiDUserReceive());
                        createCountdownTimer(120, chessGameUserReceive.getIdRoomUser(),true, message.getUserReceiveTempPort(), message.getUserSendTempPort(),message.getIdRoomUser(), message.getiDRoom(), message.getiDUserReceive(),message.getiDUserSend());
                    }
                    case -2 -> {
                        System.out.println("mode: "+ mode);
                        createCountdownTimer(180, message.getIdRoomUser(),false, message.getUserSendTempPort(), message.getUserReceiveTempPort(), chessGameUserReceive.getIdRoomUser(), message.getiDRoom(), message.getiDUserSend(), message.getiDUserReceive());
                        createCountdownTimer(180, chessGameUserReceive.getIdRoomUser(),true, message.getUserReceiveTempPort(), message.getUserSendTempPort(),message.getIdRoomUser(), message.getiDRoom(), message.getiDUserReceive(),message.getiDUserSend());
                    }
                    case -3 -> {
                        createCountdownTimer(300, message.getIdRoomUser(),false, message.getUserSendTempPort(), message.getUserReceiveTempPort(), chessGameUserReceive.getIdRoomUser(), message.getiDRoom(), message.getiDUserSend(), message.getiDUserReceive());
                        createCountdownTimer(300, chessGameUserReceive.getIdRoomUser(),true, message.getUserReceiveTempPort(), message.getUserSendTempPort(),message.getIdRoomUser(), message.getiDRoom(), message.getiDUserReceive(),message.getiDUserSend());
                    }
                    case -4 -> {
                        createCountdownTimer(600, message.getIdRoomUser(),false, message.getUserSendTempPort(), message.getUserReceiveTempPort(), chessGameUserReceive.getIdRoomUser(), message.getiDRoom(), message.getiDUserSend(), message.getiDUserReceive());
                        createCountdownTimer(600, chessGameUserReceive.getIdRoomUser(),true, message.getUserReceiveTempPort(), message.getUserSendTempPort(),message.getIdRoomUser(), message.getiDRoom(), message.getiDUserReceive(),message.getiDUserSend());
                    }
                    default ->{
                        createCountdownTimer(mode, message.getIdRoomUser(),false, message.getUserSendTempPort(), message.getUserReceiveTempPort(), chessGameUserReceive.getIdRoomUser(), message.getiDRoom(), message.getiDUserSend(), message.getiDUserReceive());
                        createCountdownTimer(mode, chessGameUserReceive.getIdRoomUser(),true, message.getUserReceiveTempPort(), message.getUserSendTempPort(),message.getIdRoomUser(), message.getiDRoom(), message.getiDUserReceive(),message.getiDUserSend());
                    }
                }
            }
            message.setUserCountdownValue(getCountdownTimerWithIdRoomUser(message.getIdRoomUser()));
            message.setOppCountdownValue(getCountdownTimerWithIdRoomUser(chessGameUserReceive.getIdRoomUser()));
            System.out.println("countDown: " + getCountdownTimerWithIdRoomUser(chessGameUserReceive.getIdRoomUser()));
            chessGameUserReceive.setUserCountdownValue(getCountdownTimerWithIdRoomUser(chessGameUserReceive.getIdRoomUser()));
            chessGameUserReceive.setOppCountdownValue(getCountdownTimerWithIdRoomUser(message.getIdRoomUser()));

            messagingTemplate.convertAndSendToUser(UserId, "/queue/chessMoveSuccess",message );
            messagingTemplate.convertAndSendToUser(UserOppId, "/queue/chessMove",chessGameUserReceive );
        }else{
            messagingTemplate.convertAndSendToUser(UserOppId, "/queue/chessMove", null);
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

                    checkAndRemoveFinishedTimersRoomUser(message.getIdRoomUser());
                    checkAndRemoveFinishedTimersRoomUser(gameStatusUserReceive.getIdRoomUser());
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

                    checkAndRemoveFinishedTimersRoomUser(message.getIdRoomUser());
                    checkAndRemoveFinishedTimersRoomUser(gameStatusUserReceive.getIdRoomUser());

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

                    checkAndRemoveFinishedTimersRoomUser(message.getIdRoomUser());
                    checkAndRemoveFinishedTimersRoomUser(gameStatusUserReceive.getIdRoomUser());
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

                    checkAndRemoveFinishedTimersRoomUser(message.getIdRoomUser());
                    checkAndRemoveFinishedTimersRoomUser(gameStatusUserReceive.getIdRoomUser());
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

                    checkAndRemoveFinishedTimersRoomUser(message.getIdRoomUser());
                    checkAndRemoveFinishedTimersRoomUser(gameStatusUserReceive.getIdRoomUser());
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

                    checkAndRemoveFinishedTimersRoomUser(message.getIdRoomUser());
                    checkAndRemoveFinishedTimersRoomUser(gameStatusUserReceive.getIdRoomUser());
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