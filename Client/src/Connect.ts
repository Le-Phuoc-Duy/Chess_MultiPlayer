import { Client } from '@stomp/stompjs';
import { Game } from './Game';
import { Color, GameStatus } from './Enum';
import { Board } from './Board';
import { RoomJoinedResponse } from './RoomJoinedResponse';
import { sendChessMove } from './PlayModule/PlayWithFriend';
import { ChatContentFrom } from './PlayModule/Chat';
import Swal from 'sweetalert2'; 
import { removeGame, setEndGame } from './PlayModule/ExtendOpt';
import { listFriendRender, profileRender, sendInvatationFriend, standingRender } from './AccountModule/Profile';

export var currentGame: Game = new Game(Color.NOT, new Board, true, 0);
const socket = new SockJS('http://' + window.location.hostname + ':8888/ws');
export var stompClient = new Client({ 
    webSocketFactory: () => socket,
    connectHeaders: {
        // tempPort: window.location.port,
        tempPort: localStorage.getItem('userID')!
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

        localStorage.setItem('iDUserSend', body.iDUserSend);
        localStorage.setItem('iDUserReceive', body.iDUserReceive);
        localStorage.setItem('iDRoom', body.iDRoom);
        localStorage.setItem('idRoomUser', body.idRoomUser);
        localStorage.setItem('chessMove', body.chessMove);
        localStorage.setItem('board', body.board);
        localStorage.setItem('color', body.color.toString()); // Chuyển đổi boolean thành string khi lưu
        localStorage.setItem('userSendTempPort', body.userSendTempPort);
        localStorage.setItem('userReceiveTempPort', body.userReceiveTempPort);
        localStorage.setItem('userSendName', body.userSendName);
        localStorage.setItem('userSendAva', body.userSendAva);
        //Trường hợp đăng nhập 1 acc trên 2 máy
        if(currentGame.playerSide === Color.NOT){
            var tmpColor: Color 
            tmpColor = localStorage.getItem('color') === "true" ? Color.WHITE : Color.BLACK;
            var tmpGame: Game = new Game(tmpColor,new Board,true,GameStatus.WIN)
            console.log(1)
            setCurrentGame(tmpGame)
            console.log("provl: "+ currentGame.playerSide )
            PromotionOverlay(currentGame.playerSide)
        }
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
    stompClient.subscribe('/user/queue/addFriend', (message) => {
        // const body = JSON.parse(message.body);
        // console.log(body.result)
        console.log("add fe" + message.body)
        switch(message.body){
            case "FRIEND_REQUEST":
                Swal.fire({
                    title: "Đối thủ gửi lời mời kết bạn",
                    showDenyButton: true,
                    showConfirmButton: true, 
                    confirmButtonText: "Chấp nhận",
                    denyButtonText: "Từ chối"
                  }).then((result) => { 
                    if (result.isConfirmed) {
                        sendInvatationFriend("FRIEND_ACCEPT")
                    } else if (result.isDenied) {
                        sendInvatationFriend("FRIEND_DENY")
                    }
                  });
                break
            case "FRIEND_DENY":
                let ToastDeny = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                ToastDeny.fire({
                    icon: "error",
                    title: "Đối thủ từ chối kết bạn"
                })
                break
            case "FRIEND_ACCEPT":
                let ToastAccept = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                ToastAccept.fire({
                    icon: "success",
                    title: "Đối thủ chấp nhận kết bạn"
                })
                break
            case "FRIEND_ALREADY":
                Swal.fire({
                    icon: 'error',
                    title: "Đã là bạn bè", 
                    showCloseButton: true, 
                    }).then((result) => {  
                    });
                break
            
        }
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
                Swal.fire({
                    title: "Đối thủ cầu hòa! Bạn có chấp nhận",
                    showDenyButton: true,
                    showConfirmButton: true, 
                    confirmButtonText: "Chấp nhận",
                    denyButtonText: "Từ chối"
                  }).then((result) => { 
                    if (result.isConfirmed) {
                      setEndGame(GameStatus.DRAW_ACCEPT);
                    } else if (result.isDenied) {
                      setEndGame(GameStatus.DRAW_DENY);
                    }
                  });
                
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
    stompClient.subscribe('/user/queue/profile', (message) => {
        const body = JSON.parse(message.body); 
        console.log("profile " + body.rank)
        profileRender(body.rank,body.elo, body.numberOfWon,body.numberOfDrawn,body.numberOfLost, body.numberOfStanding)
    });
    stompClient.subscribe('/user/queue/standing', (message) => {
        const body = JSON.parse(message.body); 
        standingRender(body)  
    });
    stompClient.subscribe('/user/queue/myFriend', (message) => {
        const body = JSON.parse(message.body);
        listFriendRender(body)  
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

document.querySelectorAll(".square").forEach((divPiece) => {
    let r = divPiece.id.charAt(0)
    let c = divPiece.id.charAt(1)
    divPiece.addEventListener("click", () => ClickPiece(Number(r), Number(c), currentGame));
});
//Chi ap dung cho self, khong ap dung cho opponent
function ClickPiece(r: number, c: number, game: Game) { 
    removeAllSeleted()
    document.getElementById(`${r}${c}`)?.classList.add("selected-square");
    if (selected) {
        console.log("secleted")
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
export var gameMode: number = -1
buttons.forEach((button) => {
    button.addEventListener('click', function () {
        // console.log("cc" + document.getElementById('gameMode')!.textContent!.trim()) 
        if (button.id === 'mode5') {
            let minute = (document.getElementById('minute') as HTMLInputElement).value;
            let second = (document.getElementById('second') as HTMLInputElement).value; 
            let m: number = parseInt(minute);
            let s: number = parseInt(second);
            let x: number = m*60 + s
            gameMode = x;

            document.getElementById('gameMode')!.innerHTML = minute + ":" + second;
        } else {
            gameMode = parseInt("-" +(button.id.toString()).charAt(4))
            document.getElementById('gameMode')!.innerHTML = button.innerHTML;
        }
    });
}); 
// Lưu trạng thái của currentGame vào localStorage trước khi reload
window.addEventListener('beforeunload', () => { 
    //Thêm !== Color.NOT để trừ trường hợp đã login nhưng chưa đánh
    if(currentGame.playerSide !== Color.NOT){
        localStorage.setItem('savedGame', JSON.stringify(currentGame));
    }
    stompClient.publish({
        destination: '/app/logout', 
        headers: {},   
    });
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
    } 
    if (localStorage.getItem('userID') != null && localStorage.getItem('savedGame') ) {
        setCurrentGameAferLoad()
            .then((result) => { 
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
//Lấy dữ liệu game từ localStorage lưu vào currentgame
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