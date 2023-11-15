package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.Entity.Roomuser;
import com.example.chess_multiplayer.Service.RoomuserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class RoomuserController {
    @Autowired
    private RoomuserService roomuserService;
    public String creatRoomuser(String idAcc, String idRoom, int mode, boolean side){
        try{
            return roomuserService.createRoomuser(idAcc,idRoom,mode,side);
        }catch (Exception e){
            return e.getMessage();
        }
    }
}
