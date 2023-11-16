export class RoomJoinedResponse {
    iDUserSend: string;
    iDUserReceive: string;
    iDRoom: string;
    idRoomUser: string;
    chessMove: string;
    board: string;
    color: boolean

    constructor(iDUserSend: string, iDUserReceive: string, iDRoom: string, idRoomUser: string, chessMove: string, board: string, color: boolean) {
        this.iDUserSend = iDUserSend;
        this.iDUserReceive = iDUserReceive;
        this.iDRoom = iDRoom;
        this.idRoomUser = idRoomUser;
        this.chessMove = chessMove;
        this.board = board;
        this.color = color
    }
}
