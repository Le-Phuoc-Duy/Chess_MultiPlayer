package com.example.chess_multiplayer.config;

import java.security.Principal;

public class PricipalCustome implements Principal {
    private String name;
    @Override
    public String getName() {
        return name;
    }
    public PricipalCustome(String name) {
        this.name = name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
