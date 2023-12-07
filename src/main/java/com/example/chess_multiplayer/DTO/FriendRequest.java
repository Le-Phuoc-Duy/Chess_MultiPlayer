package com.example.chess_multiplayer.DTO;

public class FriendRequest {
    private String userInviteID;
    private String userInvitedID;
    private  String result;

    public String getUserInviteID() {
        return userInviteID;
    }

    public void setUserInviteID(String userInviteID) {
        this.userInviteID = userInviteID;
    }

    public String getUserInvitedID() {
        return userInvitedID;
    }

    public void setUserInvitedID(String userInvitedID) {
        this.userInvitedID = userInvitedID;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}
