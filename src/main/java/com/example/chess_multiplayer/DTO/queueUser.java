package com.example.chess_multiplayer.DTO;

public class queueUser {
    private String idUserCreate;
    private int mode;
    private String userCreateTempPort;

    public String getIdUserCreate() {
        return idUserCreate;
    }

    public void setIdUserCreate(String idUserCreate) {
        this.idUserCreate = idUserCreate;
    }

    public int getMode() {
        return mode;
    }

    public void setMode(int mode) {
        this.mode = mode;
    }

    public String getUserCreateTempPort() {
        return userCreateTempPort;
    }

    public void setUserCreateTempPort(String userCreateTempPort) {
        this.userCreateTempPort = userCreateTempPort;
    }
}
