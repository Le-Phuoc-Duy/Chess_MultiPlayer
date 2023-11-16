package com.example.chess_multiplayer.DTO;

public class JoinRoom {
    private String waitingRoomId;
    private String idUserJoin;
    private String tempPort;

    public String getIdUserJoin() {
        return idUserJoin;
    }

    public void setIdUserJoin(String idUserJoin) {
        this.idUserJoin = idUserJoin;
    }

    public String getTempPort() {
        return tempPort;
    }

    public void setTempPort(String tempPort) {
        this.tempPort = tempPort;
    }

    public String getWaitingRoomId() {
        return waitingRoomId;
    }

    public void setWaitingRoomId(String waitingRoomId) {
        this.waitingRoomId = waitingRoomId;
    }
}
