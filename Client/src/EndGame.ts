import type { GameStatus } from "./Enum";

export class EndGame {
    iDUserSend: string;
    userReceiveName: string;
    iDRoom: string;
    idRoomUser: string;
    result: GameStatus;

    constructor(iDUserSend: string, userReceiveName: string, iDRoom: string, idRoomUser: string, result: GameStatus) {
        this.iDUserSend = iDUserSend;
        this.userReceiveName = userReceiveName;
        this.iDRoom = iDRoom;
        this.idRoomUser = idRoomUser;
        this.result = result;
    }
}


