export class RoomJoinedResponse {
    iDUserSend: string;
    iDUserReceive: string;
    iDRoom: string;
    idRoomUser: string;
    chessMove: string;
    board: string;
    color: boolean;
    userCountdownValue: number;
    oppCountdownValue: number;
    constructor(iDUserSend: string, iDUserReceive: string, iDRoom: string, idRoomUser: string, chessMove: string, board: string, color: boolean,userCountdownValue: number,oppCountdownValue: number) {
        this.iDUserSend = iDUserSend;
        this.iDUserReceive = iDUserReceive;
        this.iDRoom = iDRoom;
        this.idRoomUser = idRoomUser;
        this.chessMove = chessMove;
        this.board = board;
        this.color = color;
        this.userCountdownValue = userCountdownValue;
        this.oppCountdownValue = oppCountdownValue;
    }
}