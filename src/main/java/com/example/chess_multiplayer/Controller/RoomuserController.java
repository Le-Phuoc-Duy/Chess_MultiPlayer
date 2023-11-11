package com.example.chess_multiplayer.Controller;

import com.example.chess_multiplayer.Entity.Roomuser;
import com.example.chess_multiplayer.Service.RoomuserService;

public class RoomuserController {
    private RoomuserService roomuserService;
    public String creatRoomuser(String idUser, String idRoom, int mode){
        try{
            return roomuserService.createRoomuser(idUser,idRoom,mode);
        }catch (Exception e){
            return e.getMessage();
        }
    }
}
