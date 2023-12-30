package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.ChessGame;
import com.example.chess_multiplayer.DTO.FriendReponse;
import com.example.chess_multiplayer.DTO.FriendRequest;
import com.example.chess_multiplayer.DTO.InviteFriend;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Enum.Invite;
import com.example.chess_multiplayer.Service.AccountService;
import com.example.chess_multiplayer.Service.FriendService;
import com.example.chess_multiplayer.Service.RoomService;
import com.example.chess_multiplayer.Service.UserService;
import com.example.chess_multiplayer.config.UserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Random;

@Controller
public class FriendController {
    @Autowired
    private UserService userService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private FriendService friendService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private RoomService roomService;
    @Autowired
    private RoomuserController roomuserController;
    @MessageMapping("/addFriend")
    public void addFriend(@Payload FriendRequest friendRequest) {
        String AccInvitedId = accountService.getAccID(friendRequest.getUserInvitedName());
        String UserInvitedId = userService.getIdUserByIdAcc(AccInvitedId);
        User userInvite = userService.getUserById(friendRequest.getUserInviteID());
        User userInvited = userService.getUserById(UserInvitedId);
        if(friendService.isExistFriend(userInvite, userInvited)){
            friendRequest.setResult("FRIEND_ALREADY");
        }
        switch (friendRequest.getResult()){
            case "FRIEND_REQUEST" ->{
                messagingTemplate.convertAndSendToUser(userInvited.getIDUser(),"/queue/addFriend","FRIEND_REQUEST");
                break;
            }
            case "FRIEND_DENY" ->{
                messagingTemplate.convertAndSendToUser(userInvited.getIDUser(),"/queue/addFriend","FRIEND_DENY");
                break;
            }
            case "FRIEND_ACCEPT" ->{
                friendService.acceptInvitation(userInvite,userInvited);
                messagingTemplate.convertAndSendToUser(userInvite.getIDUser(),"/queue/addFriend","FRIEND_ACCEPT");
                messagingTemplate.convertAndSendToUser(userInvited.getIDUser(),"/queue/addFriend","FRIEND_ACCEPT");
                break;
            }
            case "FRIEND_ALREADY" ->{
                messagingTemplate.convertAndSendToUser(userInvite.getIDUser(),"/queue/addFriend","FRIEND_ALREADY");
                break;
            }
        }
    }
    @MessageMapping("/myFriend")
    @SendToUser("/queue/myFriend")
    public ArrayList<FriendReponse> getListFriend(@Payload String userID){
        ArrayList<FriendReponse> friendResponses = new ArrayList<>();
        ArrayList<String> listFriendID = new ArrayList<>();
        listFriendID = friendService.getListFriend(userService.getUserById(userID));
        if (listFriendID.size() > 0) {
            for (int i = 0; i< listFriendID.size(); i++){
                String userId = listFriendID.get(i);
                FriendReponse friend = new FriendReponse();
                friend.setName(userService.getUsernameByUserID(userId));
                friend.setElo(userService.getUserById(userId).getElo());
                friend.setStatus(UserInterceptor.getStatusByUserID(userId));
                friendResponses.add(friend);
            }
        }
        return friendResponses;
    }
    @MessageMapping("/inviteFriend")
    public void inviteFriend(InviteFriend invite){
        InviteFriend inviteFriend = new InviteFriend();
        String OppAccId = accountService.getAccID(invite.getUserReceiveName());
        String OppUserId = userService.getIdUserByIdAcc(OppAccId);
        inviteFriend.setMode(invite.getMode());
        inviteFriend.setiDUserSend(OppUserId);
        inviteFriend.setMessage(Invite.Request);
        inviteFriend.setUserReceiveName(invite.getUserName());
        inviteFriend.setUserName(invite.getUserReceiveName());
        messagingTemplate.convertAndSendToUser(OppUserId, "/queue/inviteFriend", inviteFriend);
    }
    @MessageMapping("/replyInvite")
    public void replyInvite(InviteFriend reply){
        if(reply.getMessage() == Invite.Accept){
            ChessGame chessGameUser1 = new ChessGame();
            ChessGame chessGameUser2 = new ChessGame();
            //khoi tao room
            String idRoomCreated = roomService.createRoom(reply.getMode());
            String AccOppId = accountService.getAccID(reply.getUserReceiveName());
            String UserOppId = userService.getIdUserByIdAcc(AccOppId);

            //khoi tao roomuser
            boolean color = generateRandomBoolean();
            String idRoomUser1Created;
            String idRoomUser2Created;
            if(color){
                idRoomUser1Created = roomuserController.creatRoomuser(reply.getiDUserSend(),idRoomCreated,reply.getMode(), true);
                idRoomUser2Created = roomuserController.creatRoomuser(UserOppId,idRoomCreated,reply.getMode(),false);
            }else{
                idRoomUser1Created = roomuserController.creatRoomuser(reply.getiDUserSend(),idRoomCreated,reply.getMode(), false);
                idRoomUser2Created = roomuserController.creatRoomuser(UserOppId,idRoomCreated,reply.getMode(),true);
            }
            //set Chess Game
            switch (reply.getMode()){
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
                    chessGameUser1.setUserCountdownValue(reply.getMode());
                    chessGameUser2.setUserCountdownValue(reply.getMode());
                }
            }

            chessGameUser1.setiDUserSend(reply.getiDUserSend());
            chessGameUser1.setiDRoom(idRoomCreated);
            chessGameUser1.setIdRoomUser(idRoomUser1Created);
            chessGameUser1.setChessMove(null);
            chessGameUser1.setUserName(userService.getUsernameByUserID(reply.getiDUserSend()));
            chessGameUser1.setUserSendAva(userService.getUserById(UserOppId).getAva());
            chessGameUser1.setUserReceiveName(userService.getUsernameByUserID(UserOppId));

            chessGameUser2.setiDUserSend(UserOppId);
            chessGameUser2.setiDRoom(idRoomCreated);
            chessGameUser2.setIdRoomUser(idRoomUser2Created);
            chessGameUser2.setChessMove(null);
            chessGameUser2.setUserName(userService.getUsernameByUserID(UserOppId));
            chessGameUser2.setUserSendAva(userService.getUserById(reply.getiDUserSend()).getAva());
            chessGameUser2.setUserReceiveName(userService.getUsernameByUserID(reply.getiDUserSend()));

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
            UserInterceptor.updateStatusPrincipal(UserOppId,"INGAME");
            UserInterceptor.updateStatusPrincipal(reply.getiDUserSend(),"INGAME");
            //send result to user2-user1
            messagingTemplate.convertAndSendToUser(UserOppId, "/queue/roomJoined", chessGameUser2);
            messagingTemplate.convertAndSendToUser(reply.getiDUserSend(), "/queue/roomJoined", chessGameUser1);
        }
        else{
            InviteFriend inviteFriend = new InviteFriend();
            String OppAccId = accountService.getAccID(reply.getUserReceiveName());
            String OppUserId = userService.getIdUserByIdAcc(OppAccId);
            inviteFriend.setMode(reply.getMode());
            inviteFriend.setiDUserSend(OppUserId);
            inviteFriend.setMessage(Invite.Deny);
            inviteFriend.setUserReceiveName(reply.getUserName());
            inviteFriend.setUserName(reply.getUserReceiveName());
            messagingTemplate.convertAndSendToUser(OppUserId, "/queue/replyInvite", inviteFriend);
        }
    }
    public boolean generateRandomBoolean() {
        Random random = new Random();
        return random.nextBoolean();
    }
}
