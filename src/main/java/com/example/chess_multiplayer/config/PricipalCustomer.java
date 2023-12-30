package com.example.chess_multiplayer.config;

import java.security.Principal;

public class PricipalCustomer implements Principal {
    private String userID;
    private String starus;
    @Override
    public String getName() {
        return userID;
    }
    public PricipalCustomer(String userID, String starus) {
        this.starus = starus;
        this.userID = userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }
    public String getStatus() {
        return starus;
    }

    public void setStatus(String status) {
        this.starus = status;
    }
}
