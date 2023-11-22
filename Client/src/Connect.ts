import { Client } from '@stomp/stompjs';
import { Game } from './Game';
import { Color } from './Enum';
import { Board } from './Board';
import { RoomJoinedResponse } from './RoomJoinedResponse';
import { sendChessMove } from './PlayModule/PlayWithFriend';
import { ChatContentFrom } from './PlayModule/Chat';

const socket = new SockJS('http://' + window.location.hostname +':8888/ws');
export const stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
        tempPort: window.location.port,
    },
    debug: (msg) => console.log(msg),
    reconnectDelay: 1000,
    heartbeatIncoming: 1000,
    heartbeatOutgoing: 1000,
});

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    // Thực hiện các xử lý khác tùy ý khi kết nối thất bại
};
stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

// Bắt sự kiện khi kết nối thành công
stompClient.onConnect = (frame) => {
    console.log("onconnect")
    stompClient.subscribe('/user/queue/chessMove', (message) => {
        const body = JSON.parse(message.body);
        console.log('iDUserSend: ' + body.iDUserSend + '\niDUserReceive: ' + body.iDUserReceive + '\niDRoom: ' + body.iDRoom + '\nidRoomUser: ' + body.idRoomUser + '\nchessMove: ' + body.chessMove + '\nboard: ' + body.board + '\ncolor: ' + body.color)

        localStorage.setItem('iDUserSend', body.iDUserSend);
        localStorage.setItem('iDUserReceive', body.iDUserReceive);
        localStorage.setItem('iDRoom', body.iDRoom);
        localStorage.setItem('idRoomUser', body.idRoomUser);
        localStorage.setItem('chessMove', body.chessMove);
        localStorage.setItem('board', body.board);
        localStorage.setItem('color', body.color.toString()); // Chuyển đổi boolean thành string khi lưu
        localStorage.setItem('userSendTempPort', body.userSendTempPort);
        localStorage.setItem('userReceiveTempPort', body.userReceiveTempPort);

        currentGame.setFullCoordinates(body.board)
        currentGame.currentTurn = true
        drawBoard(currentGame.board);
    });
    stompClient.subscribe('/topic/publicChat', (message) => {
        const body = JSON.parse(message.body);
        ChatContentFrom(body.idDUserSend, body.userSendName, body.ava, body.chat, true);
    });
    stompClient.subscribe('/user/queue/chatRoom', (message) => {
        const body = JSON.parse(message.body);
        ChatContentFrom(body.idDUserSend,body.userSendName, body.userSendAva, body.chat, false);
    });
};
// Kết nối tới server
stompClient.activate();
// Bắt sự kiện khi mất kết nối
stompClient.onDisconnect = (frame) => {
    // console.log('Disconnected from WebSocket server');
};
// Handle lỗi
stompClient.onStompError = (frame) => {
    console.error('WebSocket error:', frame);

    // Hiển thị chi tiết lỗi
    if (frame.headers) {
        console.error('Error message:', frame.headers.message);
        console.error('Error details:', frame.headers['message-details']);
    } else {
        console.error('An error occurred. Please check your connection settings.');
    }

};
var selected: Boolean = false
var startX: number = -1
var endX: number = -1
var startY: number = -1
var endY: number = -1
export var currentGame: Game = new Game(Color.WHITE)
export function setCurrentGame(game: Game) {
    currentGame = game
}
export function drawBoard(board: Board) {
    //i row, j col
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let coordinate: string = i.toString() + j.toString()
            let imgPiece = document.getElementById("i" + coordinate) as HTMLImageElement
            if (board.getBox(i, j).piece?.image)
                imgPiece.src = board.getBox(i, j).piece!.image
            else if (imgPiece) {
                imgPiece.src = ""
            }
        }
    }
}
document.querySelectorAll(".square").forEach((divPiece) => {
    let r = divPiece.id.charAt(0)
    let c = divPiece.id.charAt(1)
    divPiece.addEventListener("click", () => ClickPiece(Number(r), Number(c), currentGame));
});
//Chi ap dung cho self, khong ap dung cho opponent
function ClickPiece(r: number, c: number, game: Game) {
    if (selected) {
        console.log("secleted")
        if (game.playerMove(startX, startY, r, c)) {
            console.log("canmove" + startX + startY + r + c)
            drawBoard(game.board)
            let iDUserSend: string | null = localStorage.getItem('iDUserSend');
            let iDUserReceive: string | null = localStorage.getItem('iDUserReceive');
            let iDRoom: string | null = localStorage.getItem('iDRoom');
            let idRoomUser: string | null = localStorage.getItem('idRoomUser');
            let chessMove: string | null = localStorage.getItem('chessMove');
            let board: string | null = game.getFullCoordinates();
            //let color: string | null = localStorage.getItem('color'); // Lấy dưới dạng chuỗi
            let userSendTempPort: string | null = localStorage.getItem('userSendTempPort');
            let userReceiveTempPort: string | null = localStorage.getItem('userReceiveTempPort');
            let color: boolean;

            if (localStorage.getItem('color') == "true") {
                color = true;
            } else {
                color = false;
            }
            let CreateChessMove: RoomJoinedResponse = new RoomJoinedResponse(
                iDUserSend ?? '', // Sử dụng ?? để kiểm tra null hoặc undefined và gán giá trị mặc định nếu không tồn tại
                iDUserReceive ?? '',
                iDRoom ?? '',
                idRoomUser ?? '',
                chessMove ?? '',
                board ?? '',
                color ?? false, // Gán giá trị mặc định nếu không tồn tại hoặc không hợp lệ
                userSendTempPort ?? '',
                userReceiveTempPort ?? ''
            );
            sendChessMove(CreateChessMove);
        }
        selected = false
        startX = -1
        startY = -1
        endX = -1
        endY = -1
    } else {
        console.log("!secleted")
        selected = true
        startX = r //parseInt(coordinates.charAt(0))
        startY = c //parseInt(coordinates.charAt(1)) 
    }
}

let buttons = document.querySelectorAll('.btnMode');
buttons.forEach((button) => {
    button.addEventListener('click', function () {
        if (button.id === 'mode5') {
            let hour = (document.getElementById('hour') as HTMLInputElement).value.padStart(2, '0');
            let minute = (document.getElementById('minute') as HTMLInputElement).value.padStart(2, '0');
            let inc = (document.getElementById('inc') as HTMLInputElement).value;
            let x = hour + ":" + minute + " | " + inc;
            document.getElementById('gameMode')!.innerHTML = x;
        } else {
            document.getElementById('gameMode')!.innerHTML = button.innerHTML;
        }
    });
});

