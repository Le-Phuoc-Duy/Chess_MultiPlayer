package com.example.chess_multiplayer.DTO;

public class ChessGame {
    private String iDUserSend;
    private String userSendName;
    private int userSendAva;
    private String iDUserReceive;
    private String iDRoom;
    private String idRoomUser;
    private String chessMove;
    private String board;
    private Boolean color;
    private String userSendTempPort;
    private String userReceiveTempPort;
    private int userCountdownValue;
    private int oppCountdownValue;
    private String userReceiveName;

    public Boolean getColor() {
        return color;
    }

    public void setColor(Boolean color) {
        this.color = color;
    }

    public String getiDRoom() {
        return iDRoom;
    }

    public void setiDRoom(String iDRoom) {
        this.iDRoom = iDRoom;
    }

    public String getChessMove() {
        return chessMove;
    }

    public void setChessMove(String chessMove) {
        this.chessMove = chessMove;
    }

    public String getBoard() {
        return board;
    }

    public void setBoard(String board) {
        this.board = board;
    }

    public String getiDUserSend() {
        return iDUserSend;
    }

    public void setiDUserSend(String iDUserSend) {
        this.iDUserSend = iDUserSend;
    }


    public String getiDUserReceive() {
        return iDUserReceive;
    }

    public void setiDUserReceive(String iDUserReceive) {
        this.iDUserReceive = iDUserReceive;
    }

    public String getIdRoomUser() {
        return idRoomUser;
    }

    public void setIdRoomUser(String idRoomUser) {
        this.idRoomUser = idRoomUser;
    }

    public String getUserSendTempPort() {
        return userSendTempPort;
    }

    public void setUserSendTempPort(String userSendTempPort) {
        this.userSendTempPort = userSendTempPort;
    }

    public String getUserReceiveTempPort() {
        return userReceiveTempPort;
    }

    public void setUserReceiveTempPort(String userReceiveTempPort) {
        this.userReceiveTempPort = userReceiveTempPort;
    }

    public String getUserSendName() {
        return userSendName;
    }

    public void setUserSendName(String userSendName) {
        this.userSendName = userSendName;
    }

    public int getUserSendAva() {
        return userSendAva;
    }

    public void setUserSendAva(int userSendAva) {
        this.userSendAva = userSendAva;
    }

    public String getUserReceiveName() {
        return userReceiveName;
    }

    public void setUserReceiveName(String userReceiveName) {
        this.userReceiveName = userReceiveName;
    }

    public int getUserCountdownValue() {
        return userCountdownValue;
    }

    public void setUserCountdownValue(int userCountdownValue) {
        this.userCountdownValue = userCountdownValue;
    }

    public int getOppCountdownValue() {
        return oppCountdownValue;
    }

    public void setOppCountdownValue(int oppCountdownValue) {
        this.oppCountdownValue = oppCountdownValue;
    }
}