package com.example.chess_multiplayer.Interface;

public interface CountdownTimerListener {
    void onTimerFinish(String userSendTempPort, String userReceiveTempPort, String idRoomUser, String idRoomUserReceive, String idRoom, String idUserSend, String  idUserReceive);
    void countdown(String userSendTempPort, String userReceiveTempPort, int countdownValue);
}