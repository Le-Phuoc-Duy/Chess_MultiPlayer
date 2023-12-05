package com.example.chess_multiplayer.DTO;

public class TimeMessage {
    private int myTime;
    private int oppTime;

    public int getMyTime() {
        return myTime;
    }

    public void setMyTime(int myTime) {
        this.myTime = myTime;
    }

    public int getOppTime() {
        return oppTime;
    }

    public void setOppTime(int oppTime) {
        this.oppTime = oppTime;
    }
}
