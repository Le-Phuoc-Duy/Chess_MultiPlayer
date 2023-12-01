package com.example.chess_multiplayer.DTO;

import com.example.chess_multiplayer.Enum.Result;

public class GameStatus {
    private String iDUserSend;
    private String iDUserReceive;
    private Result result;
    private String iDRoom;
    private String idRoomUser;
    private String userSendTempPort;
    private String userReceiveTempPort;

    public String getiDUserSend() {
        return iDUserSend;
    }

    public void setiDUserSend(String iDUserSend) {
        this.iDUserSend = iDUserSend;
    }

    public String getiDUserReceive() {
        return iDUserReceive;
    }

    public void setiDUserReceive(String iDUserReceive) {
        this.iDUserReceive = iDUserReceive;
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

    public String getUserReceiveTempPort() {
        return userReceiveTempPort;
    }

    public void setUserReceiveTempPort(String userReceiveTempPort) {
        this.userReceiveTempPort = userReceiveTempPort;
    }

    public String getUserSendTempPort() {
        return userSendTempPort;
    }

    public void setUserSendTempPort(String userSendTempPort) {
        this.userSendTempPort = userSendTempPort;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }
}
