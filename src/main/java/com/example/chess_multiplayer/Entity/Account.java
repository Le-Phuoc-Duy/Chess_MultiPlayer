package com.example.chess_multiplayer.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "account", schema = "db_pbl4")
public class Account {
    @Id
    @Column(name = "IDAcc", nullable = false, length = 5)
    private String iDAcc;

    @OneToOne(mappedBy = "account",fetch = FetchType.LAZY, optional = false)
    private User user;

    @Column(name = "Username", length = 50)
    private String username;

    @Column(name = "Password", length = 100)
    private String password;


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getiDAcc() {
        return iDAcc;
    }

    public void setiDAcc(String iDAcc) {
        this.iDAcc = iDAcc;
    }
}