package com.example.chess_multiplayer.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "friend", schema = "db_pbl4")
public class Friend {
    @Id
    @Column(name = "ID", nullable = false, length = 5)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IDUser", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IDFriend", nullable = false)
    private User friend;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getFriend() {
        return friend;
    }

    public void setFriend(User friend) {
        this.friend = friend;
    }
}