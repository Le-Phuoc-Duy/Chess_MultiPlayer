package com.example.chess_multiplayer.Server;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

public class ServerApplication {
    private JFrame frame;
    private static JTextArea txtLoginLog;
    private static JTable roomLogTable;
    private static DefaultTableModel roomLogTableModel;
    private static JLabel lbNumberOfOnline;
    private static JLabel lbNumberOfRoom;
    private static int numberOfOnline;
    private static int numberOfRoom;
    public static int countOccurrences(String text, String searchTerm) {
        int count = 0;
        int index = 0;

        while ((index = text.indexOf(searchTerm, index)) != -1) {
            count++;
            index += searchTerm.length();
        }

        return count;
    }
    public static void changeOnline(String opt, String newUserID) {
        if(opt.equals("INCREASE")){
//            numberOfOnline++;
            txtLoginLog.setText(txtLoginLog.getText() + "   " + newUserID + " đã truy cập" + "\n");
        }
        if(opt.equals("DECREASE")){
//            numberOfOnline--;
//            if(numberOfOnline < 0) numberOfOnline = 0;
            txtLoginLog.setText(txtLoginLog.getText() + "   " + newUserID + " đã thoát" + "\n");
        }
        int in = countOccurrences(txtLoginLog.getText(), "đã truy cập");
        int out = countOccurrences(txtLoginLog.getText(), "đã thoát");
        lbNumberOfOnline.setText(String.valueOf(in - out));
    }
    public static void changeRoom(String opt,String RoomId, String whiteID, String blackID, String result){
        if(opt.equals("INCREASE")){
            numberOfRoom++;
            Object[] rowData = {"Phòng " +RoomId + " đã tạo", whiteID, blackID, result};
            roomLogTableModel.addRow(rowData);
        }
        if(opt.equals("DECREASE")){
            numberOfRoom--;
            if(numberOfRoom < 0) numberOfRoom = 0;
            Object[] rowData = {"Phòng " +RoomId + " đã kết thúc", whiteID, blackID, result};
            roomLogTableModel.addRow(rowData);
        }
        lbNumberOfRoom.setText(String.valueOf(numberOfRoom));
    }
    public void initUI(){
        frame = new JFrame("SERVER CHESS MULTIPLAYER");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        frame.setSize(550, 650);
        frame.setDefaultCloseOperation(3);
        frame.setTitle("SERVER CHESS MULTIPLAYER");

        JPanel pn1 = new JPanel();
        JLabel lbOnline = new JLabel("Số lượng truy cập: ");
        lbNumberOfOnline = new JLabel("0");
        pn1.add(lbOnline);
        pn1.add(lbNumberOfOnline);
        pn1.add(Box.createHorizontalStrut(350));

        JPanel pn2 = new JPanel();
        JLabel lbLog = new JLabel("Lịch sử truy cập: ");
        pn2.add(lbLog);
        pn2.add(Box.createHorizontalStrut(370));

        txtLoginLog = new JTextArea(10,50);
        txtLoginLog.setEditable(false);
        JScrollPane loginScrollPane = new JScrollPane(txtLoginLog);

        JPanel pn3 = new JPanel();
        JLabel lbRoom = new JLabel("Số lượng phòng đang chơi: ");
        lbNumberOfRoom = new JLabel("0");
        pn3.add(lbRoom);
        pn3.add(lbNumberOfRoom);
        pn3.add(Box.createHorizontalStrut(320));

        JPanel pn4 = new JPanel();
        JLabel lbLogRoom = new JLabel("Lịch sử phòng: ");
        pn4.add(lbLogRoom);
        pn4.add(Box.createHorizontalStrut(370));

        roomLogTableModel = new DefaultTableModel(new Object[]{"Mô tả", "Quân trắng", "Quân đen", "Trạng thái"}, 0);
        roomLogTable = new JTable(roomLogTableModel);
        roomLogTable.getColumnModel().getColumn(0).setPreferredWidth(120);
        JScrollPane scrollRoomLog = new JScrollPane(roomLogTable);

        JPanel pnTong = new JPanel();
        pnTong.setPreferredSize(new Dimension(500, 300));
        pnTong.add(pn1);
        pnTong.add(pn2);
        pnTong.add(loginScrollPane);
        pnTong.add(pn3);
        pnTong.add(pn4);

        JPanel pnTong2 = new JPanel();
        pnTong2.setLayout(new BorderLayout());
        pnTong2.setPreferredSize(new Dimension(500, 280));
        pnTong2.add(scrollRoomLog, BorderLayout.CENTER);

        frame.setLayout(new FlowLayout());
        frame.add(pnTong);
        frame.add(pnTong2);

        frame.setVisible(true);
    }
}
