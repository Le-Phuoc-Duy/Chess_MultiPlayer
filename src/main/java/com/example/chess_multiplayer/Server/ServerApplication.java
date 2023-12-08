package com.example.chess_multiplayer.Server;

import javax.swing.*;
import java.awt.*;

public class ServerApplication {
    private JFrame frame;
    private static JTextArea txtLoginLog;
    private static JTextArea txtRoomLog;
    public static void setTxtLoginLog(String content) {
        txtLoginLog.setText(txtLoginLog.getText() + content);
    }
    public void initUI(){
        frame = new JFrame("SERVER CHESS MULTIPLAYER");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        frame.setSize(400, 500);
        frame.setDefaultCloseOperation(3);
        frame.setTitle("Client");

        JPanel pn1 = new JPanel();
        JLabel lbOnline = new JLabel("Số lượng truy cập: ");
        JLabel lbNumberOfOnline = new JLabel("100");
        pn1.add(lbOnline);
        pn1.add(lbNumberOfOnline);
        pn1.add(Box.createHorizontalStrut(200));

        JPanel pn2 = new JPanel();
        JLabel lbLog = new JLabel("Lịch sử truy cập: ");
        pn2.add(lbLog);
        pn2.add(Box.createHorizontalStrut(235));

        txtLoginLog = new  JTextArea();
        txtLoginLog.setPreferredSize(new Dimension(360, 150));

        JPanel pn3 = new JPanel();
        JLabel lbRoom = new JLabel("Số lượng phòng: ");
        JLabel lbNumberOfRoom = new JLabel("100");
        pn3.add(lbRoom);
        pn3.add(lbNumberOfRoom);
        pn3.add(Box.createHorizontalStrut(200));

        JPanel pn4 = new JPanel();
        JLabel lbLogRoom = new JLabel("Lịch sử phòng: ");
        pn4.add(lbLogRoom);
        pn4.add(Box.createHorizontalStrut(235));

        txtRoomLog = new  JTextArea();
        txtRoomLog.setPreferredSize(new Dimension(360, 150));

        JPanel pnTong = new JPanel();
        pnTong.setPreferredSize(new Dimension(360, 900));
        pnTong.add(pn1);
        pnTong.add(pn2);
        pnTong.add(txtLoginLog);
        pnTong.add(pn3);
        pnTong.add(pn4);
        pnTong.add(txtRoomLog);

        frame.setLayout(new FlowLayout());
        frame.add(pnTong);

        frame.setVisible(true);
    }
}
