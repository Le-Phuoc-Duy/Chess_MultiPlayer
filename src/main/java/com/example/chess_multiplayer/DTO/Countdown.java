package com.example.chess_multiplayer.DTO;

public class Countdown {
    private int countdownValue;
    private String idUser;
    private Boolean side;
    private int countdownValueUserReceive;
    private String idUserReceive;

    public Countdown(int countdownValue, String idUser, Boolean side, int countdownValueUserReceive, String idUserReceive) {
        this.countdownValue = countdownValue;
        this.idUser = idUser;
        this.side = side;
        this.countdownValueUserReceive = countdownValueUserReceive;
        this.idUserReceive = idUserReceive;
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

    public int getCountdownValueUserReceive() {
        return countdownValueUserReceive;
    }

    public void setCountdownValueUserReceive(int countdownValueUserReceive) {
        this.countdownValueUserReceive = countdownValueUserReceive;
    }

    public String getIdUserReceive() {
        return idUserReceive;
    }

    public void setIdUserReceive(String idUserReceive) {
        this.idUserReceive = idUserReceive;
    }
}
