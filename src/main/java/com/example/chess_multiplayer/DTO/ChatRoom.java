package com.example.chess_multiplayer.DTO;

public class ChatRoom {
    private String idUserSend;
    private String userSendName;
    private int userSendAva;
    private String idUserReceive;
    private String idRoom;
    private String idRoomUser;
    private String chat;
    private String userSendTempPort;
    private String userReceiveTempPort;

    public String getIdUserSend() {
        return idUserSend;
    }

    public void setIdUserSend(String idUserSend) {
        this.idUserSend = idUserSend;
    }

    public String getIdUserReceive() {
        return idUserReceive;
    }

    public void setIdUserReceive(String idUserReceive) {
        this.idUserReceive = idUserReceive;
    }

    public String getIdRoom() {
        return idRoom;
    }

    public void setIdRoom(String idRoom) {
        this.idRoom = idRoom;
    }

    public String getIdRoomUser() {
        return idRoomUser;
    }

    public void setIdRoomUser(String idRoomUser) {
        this.idRoomUser = idRoomUser;
    }

    public String getChat() {
        return chat;
    }

    public void setChat(String chat) {
        this.chat = chat;
    }

    public String getUserSendTempPort() {
        return userSendTempPort;
    }

    public void setUserSendTempPort(String userSendTempPort) {
        this.userSendTempPort = userSendTempPort;
    }

    public String getUserReceiveTempPort() {
        return userReceiveTempPort;
    }

    public void setUserReceiveTempPort(String userReceiveTempPort) {
        this.userReceiveTempPort = userReceiveTempPort;
    }

    public String getUserSendName() {
        return userSendName;
    }

    public void setUserSendName(String userSendName) {
        this.userSendName = userSendName;
    }

    public int getUserSendAva() {
        return userSendAva;
    }

    public void setUserSendAva(int userSendAva) {
        this.userSendAva = userSendAva;
    }
}