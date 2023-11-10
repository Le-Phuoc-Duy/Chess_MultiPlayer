package com.example.chess_multiplayer.DTO;

public class LoginReponse {
    private String userID;
    private String message;


    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
