package com.example.chess_multiplayer.DTO;

public class FriendRequest {
    private String userInviteID;
    private String userInvitedName;
    private  String result;
    public String getUserInvitedName() {
        return userInvitedName;
    }

    public void setUserInvitedName(String userInvitedName) {
        this.userInvitedName = userInvitedName;
    }

    public String getUserInviteID() {
        return userInviteID;
    }

    public void setUserInviteID(String userInviteID) {
        this.userInviteID = userInviteID;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}
