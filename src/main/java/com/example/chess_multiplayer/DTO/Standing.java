package com.example.chess_multiplayer.DTO;

public class Standing {
    private long rank;
    private String username;
    private int numberOfWin;
    private int numberOfLose;
    private int numberOfDraw;
    private int elo;
    public long getRank() {
        return rank;
    }

    public void setRank(long rank) {
        this.rank = rank;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getNumberOfWin() {
        return numberOfWin;
    }

    public void setNumberOfWin(int numberOfWin) {
        this.numberOfWin = numberOfWin;
    }

    public int getNumberOfLose() {
        return numberOfLose;
    }

    public void setNumberOfLose(int numberOfLose) {
        this.numberOfLose = numberOfLose;
    }

    public int getNumberOfDraw() {
        return numberOfDraw;
    }

    public void setNumberOfDraw(int numberOfDraw) {
        this.numberOfDraw = numberOfDraw;
    }

    public int getElo() {
        return elo;
    }

    public void setElo(int elo) {
        this.elo = elo;
    }
}
