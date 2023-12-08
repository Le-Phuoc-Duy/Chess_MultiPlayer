package com.example.chess_multiplayer;

import com.example.chess_multiplayer.Server.ServerApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.swing.*;
import java.awt.*;

@SpringBootApplication
public class ChessMultiplayerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChessMultiplayerApplication.class, args);
        System.setProperty("java.awt.headless", "false");
        SwingUtilities.invokeLater(() -> {
            ServerApplication serverApplication = new ServerApplication();
            serverApplication.initUI();
        });
    }

}
