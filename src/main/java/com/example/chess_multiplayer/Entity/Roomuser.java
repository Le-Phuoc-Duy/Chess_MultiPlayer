package com.example.chess_multiplayer.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roomuser", schema = "db_pbl4")
public class Roomuser {
    @Id
    @Column(name = "IDRoomUser", nullable = false, length = 5)
    private String iDRoomUser;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "IDUser", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "IDRoom", nullable = false)
    private Room room;

    @Column(name = "Chat", length = 1000)
    private String chat;

    @Column(name = "Result", length = 50)
    private String result;




    public String getIDRoomUser() {
        return iDRoomUser;
    }

    public void setIDRoomUser(String iDRoomUser) {
        this.iDRoomUser = iDRoomUser;
    }


    public String getChat() {
        return chat;
    }

    public void setChat(String chat) {
        this.chat = chat;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }
}