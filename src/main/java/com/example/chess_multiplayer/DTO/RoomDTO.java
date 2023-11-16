package com.example.chess_multiplayer.DTO;

public class RoomDTO {
    private String userCreate;
    private String userJoin;
    public String getUserCreate() {
        return userCreate;
    }

    public void setUserCreate(String userCreate) {
        this.userCreate = userCreate;
    }

    public String getUserJoin() {
        return userJoin;
    }

    public void setUserJoin(String userJoin) {
        this.userJoin = userJoin;
    }
}
