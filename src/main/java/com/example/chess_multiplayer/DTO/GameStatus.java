package com.example.chess_multiplayer.DTO;

import com.example.chess_multiplayer.Enum.Result;

public class GameStatus {
    private String iDUserSend;
    private String userReceiveName;
    private Result result;
    private String iDRoom;
    private String idRoomUser;

    public String getiDUserSend() {
        return iDUserSend;
    }

    public void setiDUserSend(String iDUserSend) {
        this.iDUserSend = iDUserSend;
    }


    public String getiDRoom() {
        return iDRoom;
    }

    public void setiDRoom(String iDRoom) {
        this.iDRoom = iDRoom;
    }

    public String getIdRoomUser() {
        return idRoomUser;
    }

    public void setIdRoomUser(String idRoomUser) {
        this.idRoomUser = idRoomUser;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }

    public String getUserReceiveName() {
        return userReceiveName;
    }

    public void setUserReceiveName(String userReceiveName) {
        this.userReceiveName = userReceiveName;
    }
}
