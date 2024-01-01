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
    private String idRoomUserReceive;
    private String idRoom;
    private String idUserSend;
    private String idUserReceive;


    public CountdownTimer(int countdownValue, String idRoomUser, CountdownTimerListener listener, boolean shouldDecreaseValue, String idRoomUserReceive, String idRoom, String idUserSend, String idUserReceive) {
        this.countdownValue = countdownValue;
        this.executorService = Executors.newSingleThreadScheduledExecutor();
        this.idRoomUser = idRoomUser;
        this.listener = listener;
        this.shouldDecreaseValue = shouldDecreaseValue;
        this.idRoomUserReceive = idRoomUserReceive;
        this.idRoom = idRoom;
        this.idUserSend = idUserSend;
        this.idUserReceive = idUserReceive;
    }

    public CountdownTimer(int countdownValue,String idUserSend, String idUserReceive) {
        this.countdownValue = countdownValue;
        this.idUserSend = idUserSend;
        this.idUserReceive = idUserReceive;
        executorService = null;
        idRoomUser = null;
        listener = null;
    }

    public void startCountdown() {
        executorService.scheduleAtFixedRate(() -> {
            if (shouldDecreaseValue && countdownValue >= 0) {
                listener.countdown(idUserSend,idUserReceive,countdownValue,idRoomUserReceive);
                countdownValue--;
            } else if(countdownValue >= 0){

            }else{
                stopCountdown();
                if (listener != null) {
                    listener.onTimerFinish(idRoomUser,idRoomUserReceive,idRoom,idUserSend,idUserReceive);
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

    public String getIdUserSend() {
        return idUserSend;
    }

    public void setIdUserSend(String idUserSend) {
        this.idUserSend = idUserSend;
    }

    public String getIdUserReceive() {
        return idUserReceive;
    }

    public void setIdUserReceive(String idUserReceive) {
        this.idUserReceive = idUserReceive;
    }
}
