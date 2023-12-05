package com.example.chess_multiplayer.DTO;

import java.time.Instant;
import java.util.Date;

public class time {
    private Instant periodTime;
    private int deadLine;
    public time(Instant now, Integer mode) {
        this.periodTime = now;
        this.deadLine = mode;
    }


    public int getDeadLine() {
        return deadLine;
    }

    public void setDeadLine(int deadLine) {
        this.deadLine = deadLine;
    }

    public Instant getPeriodTime() {
        return periodTime;
    }

    public void setPeriodTime(Instant periodTime) {
        this.periodTime = periodTime;
    }
}
