package com.example.chess_multiplayer.DTO;

public class JoinRoom {
    private String waitingRoomId;
    private String idUserJoin;

    public String getIdUserJoin() {
        return idUserJoin;
    }

    public void setIdUserJoin(String idUserJoin) {
        this.idUserJoin = idUserJoin;
    }

    public String getWaitingRoomId() {
        return waitingRoomId;
    }

    public void setWaitingRoomId(String waitingRoomId) {
        this.waitingRoomId = waitingRoomId;
    }
}
