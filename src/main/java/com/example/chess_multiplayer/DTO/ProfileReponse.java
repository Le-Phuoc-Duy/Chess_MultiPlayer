package com.example.chess_multiplayer.DTO;

import java.util.HashSet;
import java.util.Set;

public class ProfileReponse {
    private String userID;
    private int elo;
    private int numberOfWon;
    private int numberOfDrawn;
    private int numberOfLost;
    private long numberOfStanding;
    private long rank;

    public long getRank() {
        return rank;
    }

    public void setRank(long rank) {
        this.rank = rank;
    }
    public long getNumberOfStanding() {
        return numberOfStanding;
    }
    public void setNumberOfStanding(long numberOfStanding) {
        this.numberOfStanding = numberOfStanding;
    }
    public int getNumberOfWon() {
        return numberOfWon;
    }

    public void setNumberOfWon(int numberOfWon) {
        this.numberOfWon = numberOfWon;
    }

    public int getNumberOfDrawn() {
        return numberOfDrawn;
    }

    public void setNumberOfDrawn(int numberOfDrawn) {
        this.numberOfDrawn = numberOfDrawn;
    }

    public int getNumberOfLost() {
        return numberOfLost;
    }

    public void setNumberOfLost(int numberOfLost) {
        this.numberOfLost = numberOfLost;
    }
    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public int getElo() {
        return elo;
    }

    public void setElo(int elo) {
        this.elo = elo;
    }
}
