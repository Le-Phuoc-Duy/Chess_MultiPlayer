package com.example.chess_multiplayer.DTO;

import com.example.chess_multiplayer.Enum.Invite;

public class InviteFriend {
    private Invite message;
    private String iDUserSend;
    private String userName;
    private String userReceiveName;
    private int mode;

    public String getiDUserSend() {
        return iDUserSend;
    }

    public void setiDUserSend(String iDUserSend) {
        this.iDUserSend = iDUserSend;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserReceiveName() {
        return userReceiveName;
    }

    public void setUserReceiveName(String userReceiveName) {
        this.userReceiveName = userReceiveName;
    }

    public int getMode() {
        return mode;
    }

    public void setMode(int mode) {
        this.mode = mode;
    }

    public Invite getMessage() {
        return message;
    }

    public void setMessage(Invite message) {
        this.message = message;
    }
}
