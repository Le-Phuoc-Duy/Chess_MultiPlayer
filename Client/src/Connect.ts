import { Client } from '@stomp/stompjs';
import { Game } from './Game';
import { Color, GameStatus } from './Enum';
import { Board } from './Board';
import { RoomJoinedResponse } from './RoomJoinedResponse';
import { sendChessMove } from './PlayModule/PlayWithFriend';
import { ChatContentFrom } from './PlayModule/Chat';
import Swal from 'sweetalert2';
import type { EndGame } from './EndGame';

const socket = new SockJS('http://' + window.location.hostname + ':8888/ws');
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
        if (currentGame.currentTurn) {
            localStorage.setItem('currentTurn', 'true');
        } else {
            localStorage.setItem('currentTurn', 'false');
        }
        drawBoard(currentGame.board);
        currentGame.checkGameStatus()
    });
    stompClient.subscribe('/topic/publicChat', (message) => {
        const body = JSON.parse(message.body);
        ChatContentFrom(body.idDUserSend, body.userSendName, body.ava, body.chat, true);
    });
    stompClient.subscribe('/user/queue/chatRoom', (message) => {
        const body = JSON.parse(message.body);
        ChatContentFrom(body.idDUserSend, body.userSendName, body.userSendAva, body.chat, false);
    });
    stompClient.subscribe('/user/queue/endGame', (message) => {
        const body = JSON.parse(message.body);
        console.log("recevie endGame" )
        console.log("body result: "+body.result )
        switch(body.result){
            case "DRAW":
                Swal.fire("Cờ hòa! Trận đấu kết thúc")
                .then(()=>{
                    removeGame()
                })
                break;
            case "WIN":
                Swal.fire("Bạn đã chiến thắng")
                .then(()=>{
                    removeGame()
                })
                break;
            case "LOSE":
                Swal.fire("Bạn đã thua")
                .then(()=>{
                    removeGame()
                })
                break;
            case "DRAW_REQUEST":
                Swal.fire("Đối thủ cầu hòa!")
                break;
            case "DRAW_ACCEPT":
                Swal.fire("Đối thủ chấp nhận hòa! Trận đấu kết thúc")
                .then(()=>{
                    removeGame()
                })
                break;
            case "DRAW_DENY":
                Swal.fire("Đối thủ từ chối cầu hòa! Trận đấu tiếp tục")

                break;
            case "QUIT":
                Swal.fire("Đối thủ thoát trận! Bạn đã chiến thắng")
                .then(()=>{
                    removeGame()
                })
                break;
            case "SURRENDER":
                    Swal.fire("Đối thủ đầu hàng! Bạn đã chiến thắng")
                    .then(()=>{
                        removeGame()
                    })
                    break;
        }
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
export var currentGame: Game = new Game(Color.NOT, new Board, true, 0);
export function setCurrentGame(game: Game) {
    currentGame = game
}
export function drawBoard(board: Board) {
    // removeAllSeleted()
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
document.querySelectorAll(".square").forEach((divPiece) => {
    let r = divPiece.id.charAt(0)
    let c = divPiece.id.charAt(1)
    divPiece.addEventListener("click", () => ClickPiece(Number(r), Number(c), currentGame));
});
//Chi ap dung cho self, khong ap dung cho opponent
function ClickPiece(r: number, c: number, game: Game) {
    let selectedSquare = document.getElementById(`${r}${c}`);
    removeAllSeleted()
    selectedSquare?.classList.add("selected-square");
    if (selected) {
        console.log("secleted")
        // document.getElementById(r.toString() + c.toString)?.classList.add("select-board-color")
        if (game.playerMove(startX, startY, r, c)) {
            console.log("canmove" + startX + startY + r + c)
            drawBoard(game.board)
            localStorage.setItem('board', game.getFullCoordinates());
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
        }else{
            removeAllSeleted()
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
//Remove màu selected
function removeAllSeleted(){
    document.querySelectorAll(".square").forEach((divPiece) => {
        divPiece.classList.remove("selected-square")
    });
}


let buttons = document.querySelectorAll('.btnMode');
buttons.forEach((button) => {
    button.addEventListener('click', function () {
        if (button.id === 'mode5') {
            let minute = (document.getElementById('minute') as HTMLInputElement).value;
            let second = (document.getElementById('second') as HTMLInputElement).value;
            let x = minute + ":" + second;
            document.getElementById('gameMode')!.innerHTML = x;
        } else {
            document.getElementById('gameMode')!.innerHTML = button.innerHTML;
        }
    });
});
// Lưu trạng thái của currentGame vào localStorage trước khi reload
window.addEventListener('beforeunload', () => {
    if(localStorage.getItem('userID') != null){
        localStorage.setItem('savedGame', JSON.stringify(currentGame));
    }
});
export function checkIsloggedIn() {
    const isLoggedIn = localStorage.getItem('userID');
    let noneLoginOverlay = document.getElementById('noneLogin');
    let logonOverlay = document.getElementById('Logon');
    let loginButton = document.getElementById('loginButton');
    let registerButton = document.getElementById('registerButton');
    let profileButton = document.getElementById('profileButton');
    let logoutButton = document.getElementById('logoutButton');
    // Nếu đã đăng nhập
    if (isLoggedIn != null) {
        noneLoginOverlay!.style.display = 'none';
        loginButton!.style.display = 'none';
        registerButton!.style.display = 'none';
        logonOverlay!.style.display = 'block';
        profileButton!.style.display = 'block';
        logoutButton!.style.display = 'block';
    } else {
        noneLoginOverlay!.style.display = 'block';
        loginButton!.style.display = 'block';
        registerButton!.style.display = 'block';
        logonOverlay!.style.display = 'none';
        profileButton!.style.display = 'none';
        logoutButton!.style.display = 'none';
    }

}
window.addEventListener('load', () => {
    checkIsloggedIn();
    if (localStorage.getItem('userID') == null) {
        PromotionOverlay(currentGame.playerSide);
    } else {
        setCurrentGameAferLoad()
            .then((result) => {
                console.log("currentGame.playerSide: " + currentGame.playerSide);
                var reDrawGame: Game = new Game(currentGame.playerSide, new Board, currentGame.currentTurn, currentGame.status);
                reDrawGame.setFullCoordinates(localStorage.getItem('board')!);
                setCurrentGame(reDrawGame)
                drawBoard(reDrawGame.board);
                PromotionOverlay(currentGame.playerSide);
            })
            .catch((error) => {
            });
    }
});
function setCurrentGameAferLoad(): Promise<string> {
    return new Promise((resolve) => {
        const storedGame = localStorage.getItem('savedGame');
        if (storedGame) {
            const parsedGame = JSON.parse(storedGame);
            currentGame = Game.fromJSON(parsedGame);
        }
        resolve("success");
    });
}

//Hiển thị bảng phong hậu
export function PromotionOverlay(color: Color) {
    let pieceValue: string = "Queen";
    var clockdiv = document.querySelectorAll('.clockdiv') as NodeListOf<HTMLElement>;
    if (color === Color.NOT) {
        clockdiv.forEach(function(element) {
            element.style.display = 'none'
        });
        document.getElementById('beforeGame')!.style.display = 'block';
        document.getElementById('afterGame')!.style.display = 'none';
        document.getElementById('promotionBlack')!.style.display = 'none';
        document.getElementById('promotionWhite')!.style.display = 'none';
    } else {
        clockdiv.forEach(function(element) {
            element.style.display = 'block'
        });
        // ava
        (document.getElementById('selfAva') as HTMLImageElement).src = './assets/ava0' + localStorage.getItem('ava') + '.png'; 
        (document.getElementById('opponentAva') as HTMLImageElement).src = './assets/ava0' + localStorage.getItem('userSendAva') + '.png'
        // name
        document.getElementById('selfName')!.innerHTML = localStorage.getItem('userName')!.toString()
        document.getElementById('opponentName')!.innerHTML = localStorage.getItem('userSendName')!.toString()
        
        document.getElementById('afterGame')!.style.display = 'block';
        document.getElementById('beforeGame')!.style.display = 'none';

        if (color === Color.BLACK) {
            document.getElementById('promotionBlack')!.style.display = 'block';
            document.getElementById('promotionWhite')!.style.display = 'none';
        }

        if (color === Color.WHITE) {
            document.getElementById('promotionWhite')!.style.display = 'block';
            document.getElementById('promotionBlack')!.style.display = 'none';
        }
    }

    return pieceValue;
}
export let piecePromoted: string = "Queen";
// Gán sự kiện click cho mỗi phần tử imgPromotion
document.querySelectorAll('.imgPromotion').forEach((element) => {
    element.addEventListener('click', function () {
        const value = element.getAttribute('value');
        if (value) {
            piecePromoted = value;
            console.log("piece value: " + piecePromoted);
            // Xóa bỏ viền màu đỏ ở tất cả các phần tử
            document.querySelectorAll('.imgPromotion').forEach((img) => {
                img.classList.remove("selected-promotion")
            });
            element.classList.add("selected-promotion")
        }
    });
});
//Hiển thị thông báo thắng thua
export function gameStatusAlert(content: string) {
    Swal.fire(content);
}
export function sendEndGame(endGame: EndGame): Promise<string> {
    return new Promise((resolve, reject) => {
        stompClient.publish({
            destination: '/app/endGame',
            headers: {},
            body: JSON.stringify({ iDUserSend: endGame.iDUserSend, iDUserReceive: endGame.iDUserReceive, iDRoom: endGame.iDRoom, idRoomUser: endGame.idRoomUser, userSendTempPort: endGame.userSendTempPort, userReceiveTempPort: endGame.userReceiveTempPort, result: endGame.result }),
        });
        resolve("Success");
    });
}

function removeGame() {
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


// Time
function getTimeRemaining(endtime: Date) {
    var t = Date.parse(endtime.toString()) - Date.parse(new Date().toString());
    var minutes = Math.floor(t / 1000 / 60);
    var seconds = Math.floor(t / 1000 - minutes * 60);
    return {
        total: t,
        minutes: minutes,
        seconds: seconds,
    };
}

function initializeClock(selfEndTime: Date, opponentEndTime: Date) {
    // var clock = document.getElementById(id);
    var selfTime = document.getElementById('selfTime');
    var opponentTime = document.getElementById('opponentTime');

    function updateClock() {
        var t1 = getTimeRemaining(selfEndTime);
        var t2 = getTimeRemaining(opponentEndTime);

        selfTime!.innerHTML =
            ('0' + t1.minutes).slice(-2) + ' : ' + ('0' + t1.seconds).slice(-2);
        opponentTime!.innerHTML =
            ('0' + t2.minutes).slice(-2) + ' : ' + ('0' + t2.seconds).slice(-2);

        if (t1.total <= 0 || t2.total <= 0) {
            clearInterval(timeinterval);
        }
    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
}
var time = new Date();
var deadline = new Date(Date.parse(time.toString()) + 1 * 1 * 60 * 1000); // Thay đổi để chỉ hiển thị 15 phút
initializeClock(deadline,deadline);