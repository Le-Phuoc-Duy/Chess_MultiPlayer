package com.example.chess_multiplayer.DTO;
import com.example.chess_multiplayer.Interface.CountdownTimerListener;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class CountdownTimer {
    private final ScheduledExecutorService executorService;
    private int countdownValue;
    private final String idRoomUser;
    private final CountdownTimerListener listener;
    private boolean shouldDecreaseValue;
    private String userSendTempPort;
    private String userReceiveTempPort;
    private String idRoomUserReceive;
    private String idRoom;
    private String idUserSend;
    private String idUserReceive;


    public CountdownTimer(int countdownValue, String idRoomUser, CountdownTimerListener listener, boolean shouldDecreaseValue, String userSendTempPort, String userReceiveTempPort, String idRoomUserReceive, String idRoom, String idUserSend, String idUserReceive) {
        this.countdownValue = countdownValue;
        this.executorService = Executors.newSingleThreadScheduledExecutor();
        this.idRoomUser = idRoomUser;
        this.listener = listener;
        this.shouldDecreaseValue = shouldDecreaseValue;
        this.userSendTempPort = userSendTempPort;
        this.userReceiveTempPort = userReceiveTempPort;
        this.idRoomUserReceive = idRoomUserReceive;
        this.idRoom = idRoom;
        this.idUserSend = idUserSend;
        this.idUserReceive = idUserReceive;
    }

    public void startCountdown() {
        executorService.scheduleAtFixedRate(() -> {
                if (shouldDecreaseValue && countdownValue >= 0) {
                    System.out.println("Countdown for " + idRoomUser + ": " + countdownValue);
                    countdownValue--;
                } else if(countdownValue >= 0){
                    System.out.println("Stop countdown for " + idRoomUser + ": " + countdownValue);
                }else{
                    stopCountdown();
                    if (listener != null) {
                        listener.onTimerFinish(userSendTempPort,userReceiveTempPort,idRoomUser,idRoomUserReceive,idRoom,idUserSend, idUserReceive);
                    }
                }
        }, 0, 1, TimeUnit.SECONDS);
    }

    public boolean isFinished() {
        return countdownValue <= 0;
    }

    public void addSeconds(int count) {
        countdownValue += count;
    }

    public String getIdRoomUser() {
        return this.idRoomUser;
    }

    public void stopCountdown() {
        executorService.shutdown();
    }

    public int getCountdownValue(){
        return this.countdownValue;
    }
    public void setShouldDecreaseValue(boolean shouldDecrease) {
        this.shouldDecreaseValue = shouldDecrease;
    }

    public String getUserSendTempPort() {
        return userSendTempPort;
    }

    public void setUserSendTempPort(String userSendTempPort) {
        this.userSendTempPort = userSendTempPort;
    }

    public String getUserReceiveTempPort() {
        return userReceiveTempPort;
    }

    public void setUserReceiveTempPort(String userReceiveTempPort) {
        this.userReceiveTempPort = userReceiveTempPort;
    }
}