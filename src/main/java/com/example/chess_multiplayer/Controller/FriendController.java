package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.FriendReponse;
import com.example.chess_multiplayer.DTO.FriendRequest;
import com.example.chess_multiplayer.Entity.Friend;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Service.FriendService;
import com.example.chess_multiplayer.Service.UserService;
import com.example.chess_multiplayer.config.UserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Optionals;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
public class FriendController {
    @Autowired
    private UserService userService;
    @Autowired
    private FriendService friendService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/addFriend")
    public void addFriend(@Payload FriendRequest friendRequest) {
        User userInvite = userService.getUserById(friendRequest.getUserInviteID());
        User userInvited = userService.getUserById(friendRequest.getUserInvitedID());
        System.out.println("addFriend" + userInvite.getIDUser() + ":" + userInvited.getIDUser());
        if(friendService.isExistFriend(userInvite, userInvited)){
            System.out.println("FRIEND_ALREADY");
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
}
