package com.example.chess_multiplayer.DTO;

public class ChessGame {
    private String iDUserSend;
    private String iDUserReceive;
    private String iDRoom;
    private String idRoomUser;
    private String chessMove;
    private String board;
    private Boolean color;

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
}
