package com.example.chess_multiplayer.Entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "room", schema = "db_pbl4")
public class Room {
    @Id
    @Column(name = "IDRoom", nullable = false, length = 5)
    private String IDRoom;

    @Column(name = "TimeStart")
    private Instant timeStart;

    @Column(name = "TimeEnd")
    private Instant timeEnd;

    @Column(name = "Mode")
    private Integer mode;

    @OneToMany(mappedBy = "room")
    private Set<Roomuser> roomusers = new LinkedHashSet<>();

    public Set<Roomuser> getRoomusers() {
        return roomusers;
    }

    public void setRoomusers(Set<Roomuser> roomusers) {
        this.roomusers = roomusers;
    }


    public Instant getTimeStart() {
        return timeStart;
    }

    public void setTimeStart(Instant timeStart) {
        this.timeStart = timeStart;
    }

    public Instant getTimeEnd() {
        return timeEnd;
    }

    public void setTimeEnd(Instant timeEnd) {
        this.timeEnd = timeEnd;
    }

    public Integer getMode() {
        return mode;
    }

    public void setMode(Integer mode) {
        this.mode = mode;
    }


    public String getIDRoom() {
        return IDRoom;
    }

    public void setIDRoom(String IDRoom) {
        this.IDRoom = IDRoom;
    }
}