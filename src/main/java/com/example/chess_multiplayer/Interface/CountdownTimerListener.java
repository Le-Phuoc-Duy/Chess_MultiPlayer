package com.example.chess_multiplayer.Interface;

public interface CountdownTimerListener {
    void onTimerFinish(String idRoomUser, String idRoomUserReceive, String idRoom, String idUserSend, String idUserReceive);
    void countdown(String idUserSend, String idUserReceive, int countdownValue, String idRoomUserReceive);
}