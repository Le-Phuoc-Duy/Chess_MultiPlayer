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
    private UserService userService;

    @MessageMapping("/profile")
    @SendToUser("/queue/profile")
    public ProfileReponse profile(@Payload String profileRequest) {
        ProfileReponse profile = new ProfileReponse();
        String UserId = profileRequest;
        profile.setUserID(UserId);
        profile.setElo(userService.getUserById(UserId).getElo());
        profile.setNumberOfWon(userService.getUserById(UserId).getWin());
        profile.setNumberOfLost(userService.getUserById(UserId).getLose());
        profile.setNumberOfDrawn(userService.getUserById(UserId).getDraw());
        profile.setNumberOfStanding(userService.getNumberOfStanding());
        profile.setRank(userService.getRank(UserId));
        return profile;
    }
    @MessageMapping("/standing")
    @SendToUser("/queue/standing")
    public List<Standing> standing(@Payload int pageIndex) {
        List<Standing> listStanding = new ArrayList<>();
        //Tạm thời mỗi page 3 user
        List<String> listUserStanding = userService.getTopUsers(pageIndex,4);
        for (int i = 0; i < listUserStanding.size(); i++) {
            String currentIdUser = listUserStanding.get(i);
            Standing standing = new Standing();
            standing.setRank(userService.getRank(currentIdUser));
            standing.setUsername(userService.getUsernameByUserID(currentIdUser));
            standing.setNumberOfWin(userService.getUserById(currentIdUser).getWin());
            standing.setNumberOfLose(userService.getUserById(currentIdUser).getLose());
            standing.setNumberOfDraw(userService.getUserById(currentIdUser).getDraw());
            standing.setElo(userService.getUserById(currentIdUser).getElo());
            listStanding.add(standing);
        }
        return listStanding;
    }
}
