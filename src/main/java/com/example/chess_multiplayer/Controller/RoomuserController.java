package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.*;
import com.example.chess_multiplayer.Entity.Roomuser;
import com.example.chess_multiplayer.Enum.Result;
import com.example.chess_multiplayer.Service.AccountService;
import com.example.chess_multiplayer.Interface.CountdownTimerListener;
import com.example.chess_multiplayer.Service.RoomService;
import com.example.chess_multiplayer.Service.RoomuserService;
import com.example.chess_multiplayer.Service.UserService;
import com.example.chess_multiplayer.config.UserInterceptor;
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
    public void onTimerFinish(String idRoomUser, String idRoomUserReceive, String idRoom, String idUserSend, String idUserReceive) {
        TimeOut timeOutUserSend = new TimeOut("Time out", idUserSend);
        TimeOut timeOutUserReviece = new TimeOut("Opponent Time out", idUserReceive);
        messagingTemplate.convertAndSendToUser(timeOutUserSend.getIdUser(), "/queue/timeout", timeOutUserSend);
        messagingTemplate.convertAndSendToUser(timeOutUserReviece.getIdUser(), "/queue/timeout", timeOutUserReviece);
        checkAndRemoveFinishedTimersUserSendId(idUserReceive);

        // Update user values
        userService.updateUserLoseAndElo(idUserSend); // Increment win by 1, and elo by 50
        userService.updateUserWinAndElo(idUserReceive); // Increment lose by 1, and decrement elo by 50

        // Update room values
        roomService.updateRoomTimeEnd(idRoom);

        // Update Room for server
        if(roomuserService.findSideByRoomIdAndUserId(idRoom,idUserSend))
            UserInterceptor.changeRoom("DECREASE",idRoom,idUserSend,idUserReceive,"Quân đen thắng");
        else
            UserInterceptor.changeRoom("DECREASE",idRoom,idUserReceive,idUserSend,"Quân trắng thắng");
        UserInterceptor.updateStatusPrincipal(idUserSend,"ONLINE");
        UserInterceptor.updateStatusPrincipal(idUserReceive,"ONLINE");
        // Update room user values
        roomuserService.updateRoomUserResult(idRoomUser, Result.LOSE.toString());
        roomuserService.updateRoomUserResult(idRoomUserReceive, Result.WIN.toString());
    }

    @Override
    public void countdown(String idUserSend, String idUserReceive, int countdownValue, String idRoomUserReceive) {
        Countdown countdownUserSend = new Countdown(countdownValue,idUserSend,true, getCountdownTimerWithIdRoomUser(idRoomUserReceive), idUserReceive);
//        Countdown countdownUserReceive = new Countdown(countdownValue, idUserReceive, false);
        messagingTemplate.convertAndSendToUser(countdownUserSend.getIdUser(), "/queue/countdown", countdownUserSend);
        countdownUserSend.setSide(false);//countdown for user receive
        messagingTemplate.convertAndSendToUser(idUserReceive, "/queue/countdown", countdownUserSend);
    }

    public void checkAndRemoveFinishedTimersUserSendId(String idUser) {
        Iterator<CountdownTimer> iterator = countdownTimers.iterator();
        while (iterator.hasNext()) {
            CountdownTimer timer = iterator.next();
            if (timer.getIdUserSend().equals(idUser)) {
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
    public void createCountdownTimer(int countdownValue, String idRoomUser, boolean shouldDecreaseValue, String idRoomUserReceive, String idRoom, String idUserSend, String idUserReceive) {
        CountdownTimer timer = new CountdownTimer(countdownValue, idRoomUser, this,shouldDecreaseValue, idRoomUserReceive, idRoom, idUserSend, idUserReceive);
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
        String AccId = accountService.getAccID(message.getUserName());
        String UserId = userService.getIdUserByIdAcc(AccId);
        String AccOppId = accountService.getAccID(message.getUserReceiveName());
        String UserOppId = userService.getIdUserByIdAcc(AccOppId);
        int mode = roomService.getRoomById(message.getiDRoom()).getMode();
        ChessGame chessGameUserReceive = new ChessGame();
        chessGameUserReceive.setiDUserSend(UserOppId);
        chessGameUserReceive.setiDRoom(message.getiDRoom());
        chessGameUserReceive.setUserSendAva(message.getUserSendAva());
        message.setUserSendAva(userService.getUserById(UserOppId).getAva());
        if(getRoomuserIdByRoomIdAndUserId(message.getiDRoom(), UserOppId)!=null){
            chessGameUserReceive.setIdRoomUser(getRoomuserIdByRoomIdAndUserId(message.getiDRoom(), UserOppId));
            chessGameUserReceive.setChessMove(message.getChessMove());
            chessGameUserReceive.setBoard(reverseString(message.getBoard()));
            chessGameUserReceive.setColor(!message.getColor());
            chessGameUserReceive.setUserReceiveName(userService.getUsernameByUserID(UserId));
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
                        createCountdownTimer(120, message.getIdRoomUser(),false, chessGameUserReceive.getIdRoomUser(), message.getiDRoom(), UserId, UserOppId);
                        createCountdownTimer(120, chessGameUserReceive.getIdRoomUser(),true, message.getIdRoomUser(), message.getiDRoom(), UserOppId, UserId);
                    }
                    case -2 -> {
                        createCountdownTimer(180, message.getIdRoomUser(),false, chessGameUserReceive.getIdRoomUser(), message.getiDRoom(), UserId, UserOppId);
                        createCountdownTimer(180, chessGameUserReceive.getIdRoomUser(),true, message.getIdRoomUser(), message.getiDRoom(), UserOppId, UserId);
                    }
                    case -3 -> {
                        createCountdownTimer(300, message.getIdRoomUser(),false, chessGameUserReceive.getIdRoomUser(), message.getiDRoom(), UserId, UserOppId);
                        createCountdownTimer(300, chessGameUserReceive.getIdRoomUser(),true, message.getIdRoomUser(), message.getiDRoom(), UserOppId, UserId);
                    }
                    case -4 -> {
                        createCountdownTimer(600, message.getIdRoomUser(),false, chessGameUserReceive.getIdRoomUser(), message.getiDRoom(), UserId, UserOppId);
                        createCountdownTimer(600, chessGameUserReceive.getIdRoomUser(),true, message.getIdRoomUser(), message.getiDRoom(), UserOppId, UserId);
                    }
                    default ->{
                        createCountdownTimer(mode, message.getIdRoomUser(),false, chessGameUserReceive.getIdRoomUser(), message.getiDRoom(), UserId, UserOppId);
                        createCountdownTimer(mode, chessGameUserReceive.getIdRoomUser(),true, message.getIdRoomUser(), message.getiDRoom(), UserOppId, UserId);
                    }
                }
            }
            message.setUserCountdownValue(getCountdownTimerWithIdRoomUser(message.getIdRoomUser()));
            message.setOppCountdownValue(getCountdownTimerWithIdRoomUser(chessGameUserReceive.getIdRoomUser()));
            chessGameUserReceive.setUserCountdownValue(getCountdownTimerWithIdRoomUser(chessGameUserReceive.getIdRoomUser()));
            chessGameUserReceive.setOppCountdownValue(getCountdownTimerWithIdRoomUser(message.getIdRoomUser()));

            messagingTemplate.convertAndSendToUser(UserId, "/queue/chessMoveSuccess",message);
            messagingTemplate.convertAndSendToUser(UserOppId, "/queue/chessMove",chessGameUserReceive );
        }else{
            messagingTemplate.convertAndSendToUser(UserId, "/queue/chessMove", null);
        }
    }
    @MessageMapping("/endGame")
    public void endGame(GameStatus message) {
        String AccOppId = accountService.getAccID(message.getUserReceiveName());
        String UserOppId = userService.getIdUserByIdAcc(AccOppId);
        GameStatus gameStatusUserReceive = new GameStatus();
        gameStatusUserReceive.setiDUserSend(UserOppId);
        gameStatusUserReceive.setiDRoom(message.getiDRoom());
        gameStatusUserReceive.setUserReceiveName(userService.getUsernameByUserID(message.getiDUserSend()));
        if(getRoomuserIdByRoomIdAndUserId(message.getiDRoom(), UserOppId)!=null){
            gameStatusUserReceive.setIdRoomUser(getRoomuserIdByRoomIdAndUserId(message.getiDRoom(), UserOppId));
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
                    if(roomuserService.findSideByRoomIdAndUserId(gameStatusUserReceive.getiDRoom(), message.getiDUserSend()))
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),message.getiDUserSend(),gameStatusUserReceive.getiDUserSend(),"Quân trắng thắng");
                    else
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),gameStatusUserReceive.getiDUserSend(),message.getiDUserSend(),"Quân đen thắng");
                    UserInterceptor.updateStatusPrincipal(gameStatusUserReceive.getiDUserSend(),"ONLINE");
                    UserInterceptor.updateStatusPrincipal(message.getiDUserSend(),"ONLINE");
                    messagingTemplate.convertAndSendToUser(gameStatusUserReceive.getiDUserSend(), "/queue/endGame",gameStatusUserReceive );
                    messagingTemplate.convertAndSendToUser(message.getiDUserSend(), "/queue/endGame",message );
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
                    if(roomuserService.findSideByRoomIdAndUserId(gameStatusUserReceive.getiDRoom(), message.getiDUserSend()))
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),message.getiDUserSend(),gameStatusUserReceive.getiDUserSend(),"Hòa");
                    else
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),gameStatusUserReceive.getiDUserSend(),message.getiDUserSend(),"Hòa");
                    UserInterceptor.updateStatusPrincipal(gameStatusUserReceive.getiDUserSend(),"ONLINE");
                    UserInterceptor.updateStatusPrincipal(message.getiDUserSend(),"ONLINE");
                    messagingTemplate.convertAndSendToUser(gameStatusUserReceive.getiDUserSend(), "/queue/endGame",gameStatusUserReceive );
                    messagingTemplate.convertAndSendToUser(message.getiDUserSend(), "/queue/endGame",message );
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
                    if(roomuserService.findSideByRoomIdAndUserId(gameStatusUserReceive.getiDRoom(), message.getiDUserSend()))
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),message.getiDUserSend(),gameStatusUserReceive.getiDUserSend(),"Quân đen thắng");
                    else
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),gameStatusUserReceive.getiDUserSend(),message.getiDUserSend(),"Quân trắng thắng");
                    UserInterceptor.updateStatusPrincipal(gameStatusUserReceive.getiDUserSend(),"ONLINE");
                    UserInterceptor.updateStatusPrincipal(message.getiDUserSend(),"ONLINE");
                    messagingTemplate.convertAndSendToUser(gameStatusUserReceive.getiDUserSend(), "/queue/endGame",gameStatusUserReceive );
                    messagingTemplate.convertAndSendToUser(message.getiDUserSend(), "/queue/endGame",message );

                }
                case DRAW_REQUEST -> {
                    gameStatusUserReceive.setResult(Result.DRAW_REQUEST);
                    messagingTemplate.convertAndSendToUser(gameStatusUserReceive.getiDUserSend(), "/queue/endGame",gameStatusUserReceive );
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
                    if(roomuserService.findSideByRoomIdAndUserId(gameStatusUserReceive.getiDRoom(), message.getiDUserSend()))
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),message.getiDUserSend(),gameStatusUserReceive.getiDUserSend(),"Hòa");
                    else
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),gameStatusUserReceive.getiDUserSend(),message.getiDUserSend(),"Hòa");
                    UserInterceptor.updateStatusPrincipal(gameStatusUserReceive.getiDUserSend(),"ONLINE");
                    UserInterceptor.updateStatusPrincipal(message.getiDUserSend(),"ONLINE");
                    messagingTemplate.convertAndSendToUser(gameStatusUserReceive.getiDUserSend(), "/queue/endGame",gameStatusUserReceive );
                    messagingTemplate.convertAndSendToUser(message.getiDUserSend(), "/queue/endGame",message );
                }
                case DRAW_DENY -> {
                    gameStatusUserReceive.setResult(Result.DRAW_DENY);
                    messagingTemplate.convertAndSendToUser(gameStatusUserReceive.getiDUserSend(), "/queue/endGame",gameStatusUserReceive );
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
                    if(roomuserService.findSideByRoomIdAndUserId(gameStatusUserReceive.getiDRoom(), message.getiDUserSend()))
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),message.getiDUserSend(),gameStatusUserReceive.getiDUserSend(),"Quân đen thắng");
                    else
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),gameStatusUserReceive.getiDUserSend(),message.getiDUserSend(),"Quân trắng thắng");
                    UserInterceptor.updateStatusPrincipal(gameStatusUserReceive.getiDUserSend(),"ONLINE");
                    messagingTemplate.convertAndSendToUser(gameStatusUserReceive.getiDUserSend(), "/queue/endGame",gameStatusUserReceive );
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
                    if(roomuserService.findSideByRoomIdAndUserId(gameStatusUserReceive.getiDRoom(), message.getiDUserSend()))
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),message.getiDUserSend(),gameStatusUserReceive.getiDUserSend(),"Quân đen thắng");
                    else
                        UserInterceptor.changeRoom("DECREASE",gameStatusUserReceive.getiDRoom(),gameStatusUserReceive.getiDUserSend(),message.getiDUserSend(),"Quân trắng thắng");
                    UserInterceptor.updateStatusPrincipal(gameStatusUserReceive.getiDUserSend(),"ONLINE");
                    UserInterceptor.updateStatusPrincipal(message.getiDUserSend(),"ONLINE");
                    messagingTemplate.convertAndSendToUser(gameStatusUserReceive.getiDUserSend(), "/queue/endGame",gameStatusUserReceive );
                    messagingTemplate.convertAndSendToUser(message.getiDUserSend(), "/queue/endGame",message );
                }
                default -> {
                    gameStatusUserReceive.setResult(Result.ACTIVE);
                }
            }
        }else{
            messagingTemplate.convertAndSendToUser(gameStatusUserReceive.getiDUserSend(), "/queue/endGame", null);
        }

    }
    @MessageMapping("/chatRoom")
    public void chatRoom(ChatRoom message) {
        roomuserService.updateChatById(message.getIdRoomUser(),message.getChat());
        ChatRoom chatRoomUserReceive = new ChatRoom();
        String AccOppId = accountService.getAccID(message.getUserReceiveName());
        String UserOppId = userService.getIdUserByIdAcc(AccOppId);
        chatRoomUserReceive.setIdUserSend(UserOppId);//ban than
        chatRoomUserReceive.setUserSendName(userService.getUsernameByUserID(message.getIdUserSend()));//bi sai thanh doi thu
        chatRoomUserReceive.setUserSendAva(userService.getUserById(message.getIdUserSend()).getAva());//bi sai thanh doi thu
        chatRoomUserReceive.setIdRoom(message.getIdRoom());
        chatRoomUserReceive.setUserReceiveName(userService.getUsernameByUserID(message.getIdUserSend()));//doi thu
        if(getRoomuserIdByRoomIdAndUserId(message.getIdRoom(), UserOppId)!=null){
            chatRoomUserReceive.setIdRoomUser(getRoomuserIdByRoomIdAndUserId(message.getIdRoom(), UserOppId));
            chatRoomUserReceive.setChat(message.getChat());
            messagingTemplate.convertAndSendToUser(UserOppId, "/queue/chatRoom",chatRoomUserReceive );
            chatRoomUserReceive.setIdUserSend(message.getIdUserSend());
            messagingTemplate.convertAndSendToUser(message.getIdUserSend(), "/queue/chatRoom",chatRoomUserReceive );
        }else{
            messagingTemplate.convertAndSendToUser(UserOppId, "/queue/chatRoom", null);
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