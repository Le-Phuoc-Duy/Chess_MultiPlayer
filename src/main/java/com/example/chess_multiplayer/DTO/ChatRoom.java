package com.example.chess_multiplayer.DTO;

public class ChatRoom {
    private String idUserSend;
    private String userSendName;
    private int userSendAva;
    private String idRoom;
    private String idRoomUser;
    private String chat;
    private String userReceiveName;

    public String getIdUserSend() {
        return idUserSend;
    }

    public void setIdUserSend(String idUserSend) {
        this.idUserSend = idUserSend;
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

    public String getUserReceiveName() {
        return userReceiveName;
    }

    public void setUserReceiveName(String userReceiveName) {
        this.userReceiveName = userReceiveName;
    }
}