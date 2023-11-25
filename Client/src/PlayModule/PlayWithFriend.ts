import { Color } from "../Enum";
import { PromotionOverlay, currentGame, drawBoard, setCurrentGame, stompClient } from "../Connect";
import { RoomJoinedResponse } from "../RoomJoinedResponse";
import Swal from "sweetalert2";
import { Game } from "../Game";
import { Board } from '../Board';
function createRoom(mode: number): Promise<string> {
    console.log("mode" + mode) 
    return new Promise((resolve, reject) => {
        stompClient.publish({
            destination: '/app/createRoom',
            headers: {},
            body: JSON.stringify({ userCreateId: localStorage.getItem('userID'), mode: mode, tempPort: window.location.port }),
        });

        stompClient.subscribe('/user/queue/roomCreated', (message) => {
            const body = JSON.parse(message.body);
            // console.log('UserID: ' + body.userID + '\nMessage: ' + body.message);
            console.log('waitingRoomId: ' + body.waitingRoomId + '\nuserCreateId: ' + body.userCreateId + '\nsessionUserCreateId: ' + body.sessionUserCreateId + '\nmode: ' + body.mode);
            resolve(body.waitingRoomId);
        });

    });
}
function joinRoom(): Promise<RoomJoinedResponse> { 
    return new Promise((resolve, reject) => {
        stompClient.subscribe('/user/queue/roomJoined', (message) => {
            const body = JSON.parse(message.body);
            // console.log('UserID: ' + body.userID + '\nMessage: ' + body.message);
            console.log('iDUserSend: ' + body.iDUserSend + '\niDUserReceive: ' + body.iDUserReceive + '\niDRoom: ' + body.iDRoom + '\nidRoomUser: ' + body.idRoomUser + '\nchessMove: ' + body.chessMove + '\nboard: ' + body.board + '\ncolor: ' + body.color + '\nuserSendTempPort: ' + body.userSendTempPort + +'\nuserReceiveTempPort: ' + body.userReceiveTempPort);
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
            resolve(body);
        });
    });
}
export function sendChessMove(CreateChessMove: RoomJoinedResponse): Promise<string> {
    return new Promise((resolve, reject) => {
        stompClient.publish({
            destination: '/app/chessMove',
            headers: {},
            body: JSON.stringify({ iDUserSend: CreateChessMove.iDUserSend, iDUserReceive: CreateChessMove.iDUserReceive, iDRoom: CreateChessMove.iDRoom, idRoomUser: CreateChessMove.idRoomUser, chessMove: CreateChessMove.chessMove, board: CreateChessMove.board, color: CreateChessMove.color, userSendTempPort: CreateChessMove.userSendTempPort, userReceiveTempPort: CreateChessMove.userReceiveTempPort }),
        });
        resolve("Success");
    });
}

document.getElementById("playWithFriend")?.addEventListener("click", async () => {
    const inputOptions = new Promise((resolve) => {
        resolve({
            "joinRoom": "Phòng có sẵn",
            "createRoom": "Tạo phòng"
        });
    });
    const { value: option } = await Swal.fire({
        title: "Chơi với bạn",
        input: "radio",
        inputOptions,
        inputValidator: (value) => {
            if (!value) {
                return "Nhập lựa chọn!";
            }
        }
    });
    if (option) {
        if (option === "joinRoom") {
            const { value: formValues } = await Swal.fire({
                // input: "number",
                title: "Mã phòng",
                html:
                    '<input type="number" id="swal-input1" class="swal2-input" placeholder="Nhập mã phòng">',
                focusConfirm: false,
                preConfirm: () => {
                    let idRoom = (document.getElementById('swal-input1')! as HTMLInputElement).value
                    if (!idRoom) {
                        Swal.showValidationMessage("Vui lòng nhập mã phòng!")
                    } else {
                        return [idRoom];
                    }
                }
            });
            if (formValues) {
                stompClient.publish({
                    destination: '/app/joinRoom',
                    body: JSON.stringify({ waitingRoomId: formValues[0], idUserJoin: localStorage.getItem('userID'), tempPort: window.location.port }),
                })
                joinRoom()
                    .then((result) => {
                        if (result) {
                            console.log('iDUserSend: ' + result.iDUserSend + '\niDUserReceive: ' + result.iDUserReceive + '\niDRoom: ' + result.iDRoom + '\nidRoomUser: ' + result.idRoomUser + '\nchessMove: ' + result.chessMove + '\nboard: ' + result.board + '\ncolor: ' + result.color);
                            if (result.color) {
                                console.log("self la white, opp la black")
                                var gameByJoin: Game = new Game(Color.WHITE, new Board,true, 0); 
                            } else {
                                console.log("self la black, opp la white")
                                var gameByJoin: Game = new Game(Color.BLACK, new Board,false, 0); 
                            }
                            gameByJoin.setFullCoordinates(result.board);
                            setCurrentGame(gameByJoin)
                            drawBoard(gameByJoin.board);
                            PromotionOverlay(currentGame.playerSide);
                            const Toast = Swal.mixin({
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
                            Toast.fire({
                                icon: "success",
                                title: "Vào phòng thành công. Bắt đầu trận đấu"
                            });
                        }
                    })
                    .catch((error) => {
                        const Toast = Swal.mixin({
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
                        Toast.fire({
                            icon: "success",
                            title: "Mã phòng không tồn tại"
                        });
                    });
            }
        }
        if (option === "createRoom") {
            let gameMode: number
            switch (document.getElementById('gameMode')!.innerHTML) {
                case "2 | 1 phút":
                    gameMode = -1
                    break;
                case "3 | 2 phút":
                    gameMode = -2
                    break;
                case "5 phút":
                    gameMode = -3
                    break;
                case "10 phút":
                    gameMode = -4
                    break;
                default:
                    let minute = (document.getElementById('minute') as HTMLInputElement).value;
                    let second = (document.getElementById('second') as HTMLInputElement).value;
                    let m: number = parseInt(minute);
                    let s: number = parseInt(second);
                    let x: number = m*60 + s
                    gameMode = x;
                    break;
            }
            createRoom(gameMode)
                    .then((result) => {
                        if (result) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Tạo phòng thành công!',
                                text: `ID phòng của bạn là: ${result.toString()}`,
                            })
                            joinRoom().then((result) => {
                                if (result) {
                                    const Toast = Swal.mixin({
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
                                    Toast.fire({
                                        icon: "success",
                                        title: "Đã có người chơi khác tham gia, Bắt đầu trận đấu"
                                    });
                                    if (result.color) {
                                        console.log("self la white, opp la black")
                                        var gameByCreate: Game = new Game(Color.WHITE, new Board,true, 0); 
                                    } else {
                                        console.log("self la black, opp la white")
                                        var gameByCreate: Game = new Game(Color.BLACK, new Board,false, 0); 
                                    }
                                    gameByCreate.setFullCoordinates(result.board);
                                    setCurrentGame(gameByCreate)
                                    drawBoard(gameByCreate.board);
                                    PromotionOverlay(currentGame.playerSide);
                                }
                            })
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            text: "Tạo phòng thất bại",
                        }).then(() => {
                        });
                    });
        }
    }
})