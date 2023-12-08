package com.example.chess_multiplayer.DTO;

public class Countdown {
    private int countdownValue;
    private String idUser;
    private Boolean side;

    public Countdown(int countdownValue, String idUser, Boolean side) {
        this.countdownValue = countdownValue;
        this.idUser = idUser;
        this.side = side;
    }

    public int getCountdownValue() {
        return countdownValue;
    }

    public void setCountdownValue(int countdownValue) {
        this.countdownValue = countdownValue;
    }

    public String getIdUser() {
        return idUser;
    }

    public void setIdUser(String idUser) {
        this.idUser = idUser;
    }

    public Boolean getSide() {
        return side;
    }

    public void setSide(Boolean side) {
        this.side = side;
    }
}
