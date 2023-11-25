package com.example.chess_multiplayer.DTO;

public class publicChat {
    private String idDUserSend;
    private String userSendName;
    private String chat;
    private int ava;


    public String getIdDUserSend() {
        return idDUserSend;
    }

    public void setIdDUserSend(String idDUserSend) {
        this.idDUserSend = idDUserSend;
    }

    public String getChat() {
        return chat;
    }

    public void setChat(String chat) {
        this.chat = chat;
    }

    public int getAva() {
        return ava;
    }

    public void setAva(int ava) {
        this.ava = ava;
    }


    public String getUserSendName() {
        return userSendName;
    }

    public void setUserSendName(String userSendName) {
        this.userSendName = userSendName;
    }
}
