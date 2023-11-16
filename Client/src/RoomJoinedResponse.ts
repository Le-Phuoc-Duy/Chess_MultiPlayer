export class RoomJoinedResponse {
    iDUserSend: string;
    iDUserReceive: string;
    iDRoom: string;
    idRoomUser: string;
    chessMove: string;
    board: string;

    constructor(iDUserSend: string, iDUserReceive: string, iDRoom: string, idRoomUser: string, chessMove: string, board: string) {
        this.iDUserSend = iDUserSend;
        this.iDUserReceive = iDUserReceive;
        this.iDRoom = iDRoom;
        this.idRoomUser = idRoomUser;
        this.chessMove = chessMove;
        this.board = board;
    }
}
