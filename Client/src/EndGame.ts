import type { GameStatus } from "./Enum";

export class EndGame {
    iDUserSend: string;
    iDUserReceive: string;
    iDRoom: string;
    idRoomUser: string;
    userSendTempPort: string;
    userReceiveTempPort: string;
    result: GameStatus;

    constructor(iDUserSend: string, iDUserReceive: string, iDRoom: string, idRoomUser: string, userSendTempPort: string, userReceiveTempPort: string, result: GameStatus) {
        this.iDUserSend = iDUserSend;
        this.iDUserReceive = iDUserReceive;
        this.iDRoom = iDRoom;
        this.idRoomUser = idRoomUser;
        this.userSendTempPort = userSendTempPort;
        this.userReceiveTempPort = userReceiveTempPort;
        this.result = result;
    }
}


