import Swal from "sweetalert2";
import { Color, GameStatus } from "../Enum";
import { EndGame } from "../EndGame";
import { PromotionOverlay, stompClient } from "../Connect";

document.getElementById('surrender')!.addEventListener('click',function(){
    setEndGame(GameStatus.SURRENDER)
})
document.getElementById('drawRequest')!.addEventListener('click',function(){
    setEndGame(GameStatus.DRAW_REQUEST)
}) 

//Hiển thị thông báo thắng thua
export function gameStatusAlert(content: string) {
    Swal.fire(content);
}
export function removeBoard() {
    // removeAllSeleted()
    //i row, j col
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let coordinate: string = i.toString() + j.toString()
            let imgPiece = document.getElementById("i" + coordinate) as HTMLImageElement
            imgPiece.src = ""
        }
    }
}
function sendEndGame(endGame: EndGame): Promise<string> {
    return new Promise((resolve, reject) => {
        stompClient.publish({
            destination: '/app/endGame',
            headers: {},
            body: JSON.stringify({ iDUserSend: endGame.iDUserSend, iDUserReceive: endGame.iDUserReceive, iDRoom: endGame.iDRoom, idRoomUser: endGame.idRoomUser, userSendTempPort: endGame.userSendTempPort, userReceiveTempPort: endGame.userReceiveTempPort, result: endGame.result }),
        });
        resolve("Success");
    });
}

export function removeGame() {
    localStorage.removeItem("iDUserSend")
    localStorage.removeItem("iDUserReceive")
    localStorage.removeItem("iDRoom")
    localStorage.removeItem("idRoomUser")
    localStorage.removeItem("chessMove")
    localStorage.removeItem("board")
    localStorage.removeItem("color")
    localStorage.removeItem("userSendTempPort")
    localStorage.removeItem("userReceiveTempPort")
    removeBoard()
    PromotionOverlay(Color.NOT);
    throw new Error('Function not implemented.');
}
export function setEndGame(gameStatus: GameStatus){
    let iDUserSend: string | null = localStorage.getItem('iDUserSend');
    let iDUserReceive: string | null = localStorage.getItem('iDUserReceive');
    let iDRoom: string | null = localStorage.getItem('iDRoom');
    let idRoomUser: string | null = localStorage.getItem('idRoomUser');
    let userSendTempPort: string | null = localStorage.getItem('userSendTempPort');
    let userReceiveTempPort: string | null = localStorage.getItem('userReceiveTempPort');
    let result: GameStatus | null = gameStatus
    let endGame: EndGame = new EndGame(
        iDUserSend ?? '', // Sử dụng ?? để kiểm tra null hoặc undefined và gán giá trị mặc định nếu không tồn tại
        iDUserReceive ?? '',
        iDRoom ?? '',
        idRoomUser ?? '',
        userSendTempPort ?? '',
        userReceiveTempPort ?? '',
        result ?? ''
    );
    sendEndGame(endGame);
}