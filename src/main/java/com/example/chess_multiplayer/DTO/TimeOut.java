package com.example.chess_multiplayer.DTO;

public class TimeOut {
    private String notify;
    private String userTempPort;


    public TimeOut(String notify, String userTempPort) {
        this.notify = notify;
        this.userTempPort = userTempPort;
    }


    public String getUserTempPort() {
        return userTempPort;
    }

    public void setUserTempPort(String userTempPort) {
        this.userTempPort = userTempPort;
    }

    public String getNotify() {
        return notify;
    }

    public void setNotify(String notify) {
        this.notify = notify;
    }
}
