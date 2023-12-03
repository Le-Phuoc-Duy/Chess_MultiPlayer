package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.DTO.ProfileReponse;
import com.example.chess_multiplayer.DTO.Standing;
import com.example.chess_multiplayer.Service.AccountService;
import com.example.chess_multiplayer.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Controller
public class ProfileController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private UserController userController;
    @Autowired
    private UserService userService;
    @Autowired
    private AccountService accountService;

    @MessageMapping("/profile")
    @SendToUser("/queue/profile")
    public ProfileReponse profile(@Payload String profileRequest) {
        ProfileReponse profile = new ProfileReponse();
//        String UserId = profileRequest.getUserID();
        String UserId = profileRequest;
        profile.setUserID(UserId);
        profile.setElo(userService.getUserById(UserId).getElo());
        profile.setNumberOfWon(userService.getUserById(UserId).getWin());
        profile.setNumberOfLost(userService.getUserById(UserId).getLose());
        profile.setNumberOfDrawn(userService.getUserById(UserId).getDraw());
        profile.setNumberOfStanding(userService.getNumberOfStanding());
        profile.setRank(userService.getRank(UserId));           //?? viết ở đây đúng k
        return profile;
//        messagingTemplate.convertAndSendToUser(profileRequest.getTempPort(), "/queue/profile", profile);
    }
    @MessageMapping("/standing")
    @SendToUser("/queue/standing")
    public List<Standing> standing(@Payload int pageIndex) {
        List<Standing> listStanding = new ArrayList<>();
        //Tạm thời mỗi page 3 user
        List<String> listUserStanding = userService.getTopUsers(pageIndex,4);
        long rankCnt = userService.getRank(listUserStanding.get(0));
        for (int i = 0; i < listUserStanding.size(); i++) {
            String currentIdUser = listUserStanding.get(i);
            Standing standing = new Standing();
            if(i>0){
                String previousIdUser = listUserStanding.get(i - 1);
                if(userService.getUserById(currentIdUser).getElo() < userService.getUserById(previousIdUser).getElo()){
                    rankCnt++;
                }
            }
            standing.setRank(rankCnt);
            standing.setUsername(userService.getUsernameByUserID(currentIdUser));
            standing.setNumberOfWin(userService.getUserById(currentIdUser).getWin());
            standing.setNumberOfLose(userService.getUserById(currentIdUser).getLose());
            standing.setNumberOfDraw(userService.getUserById(currentIdUser).getDraw());
            standing.setElo(userService.getUserById(currentIdUser).getElo());
            listStanding.add(standing);
        }
        return listStanding;
//        messagingTemplate.convertAndSendToUser(profileRequest.getTempPort(), "/queue/standing", userService.getTopUsers(1,13));
    }
}