package com.example.chess_multiplayer.DTO;

public class RegisterRequest {
    private String username;
    private String password;
    private String tempPort;
    private int ava;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTempPort() {
        return tempPort;
    }

    public void setTempPort(String tempPort) {
        this.tempPort = tempPort;
    }

    public int getAva() {
        return ava;
    }

    public void setAva(int ava) {
        this.ava = ava;
    }
}
