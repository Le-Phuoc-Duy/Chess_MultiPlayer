package com.example.chess_multiplayer.DTO;

public class TimeOut {
    private String notify;
    private String idUser;

    public TimeOut(String notify, String idUser) {
        this.notify = notify;
        this.idUser = idUser;
    }
    public String getNotify() {
        return notify;
    }

    public void setNotify(String notify) {
        this.notify = notify;
    }

    public String getIdUser() {
        return idUser;
    }

    public void setIdUser(String idUser) {
        this.idUser = idUser;
    }
}
