package com.example.chess_multiplayer.config;

import java.security.Principal;

public class PricipalCustome implements Principal {
    private String name;
    private String starus;
    @Override
    public String getName() {
        return name;
    }
    public PricipalCustome(String name, String starus) {
        this.starus = starus;
        this.name = name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getStatus() {
        return starus;
    }

    public void setStatus(String status) {
        this.starus = status;
    }
}
