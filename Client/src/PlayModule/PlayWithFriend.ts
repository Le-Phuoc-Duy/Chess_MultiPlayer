import { Color } from "../Enum";
import { PromotionOverlay, currentGame, drawBoard, setCurrentGame, stompClient, initializeClockSelf, initializeClockOpp } from "../Connect";
import { RoomJoinedResponse } from "../RoomJoinedResponse";
import Swal from "sweetalert2";
import { Game } from "../Game";
import { Board } from '../Board';
function createRoom(mode: number): Promise<string> {
    return new Promise((resolve, reject) => {
        stompClient.publish({
            destination: '/app/createRoom',
            headers: {},
            body: JSON.stringify({ userCreateId: localStorage.getItem('userID'), mode: mode}),
        });

        stompClient.subscribe('/user/queue/roomCreated', (message) => {
            const body = JSON.parse(message.body);
            resolve(body.waitingRoomId);
        });

    });
}
export function joinRoom(): Promise<RoomJoinedResponse> { 
    return new Promise((resolve, reject) => {
        stompClient.subscribe('/user/queue/roomJoined', (message) => {
            const body = JSON.parse(message.body);
            localStorage.setItem('iDUserSend', body.iDUserSend);
            localStorage.setItem('iDRoom', body.iDRoom);
            localStorage.setItem('idRoomUser', body.idRoomUser);
            localStorage.setItem('chessMove', body.chessMove);
            localStorage.setItem('board', body.board);
            localStorage.setItem('color', body.color.toString()); 
            localStorage.setItem('userSendAva', body.userSendAva);
            localStorage.setItem('userCountdownValue', body.userCountdownValue);
            localStorage.setItem('userReceiveName', body.userReceiveName);
            resolve(body);
        });
    });
}
export function sendChessMove(CreateChessMove: RoomJoinedResponse): Promise<string> {
    return new Promise((resolve, reject) => {
        stompClient.publish({
            destination: '/app/chessMove',
            headers: {},
            body: JSON.stringify({iDUserSend: CreateChessMove.iDUserSend, userName: localStorage.getItem('userName'),
                                    iDRoom: CreateChessMove.iDRoom, userSendAva: localStorage.getItem('ava'),
                                    idRoomUser: CreateChessMove.idRoomUser,  chessMove: CreateChessMove.chessMove, 
                                    board: CreateChessMove.board, color: CreateChessMove.color, 
                                    userReceiveName: localStorage.getItem('userReceiveName') }),
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
                    body: JSON.stringify({ waitingRoomId: formValues[0], idUserJoin: localStorage.getItem('userID')}),
                })
                joinRoom()
                  .then((result) => {
                      if (result) {
                          if (result.color) {
                              var gameByJoin: Game = new Game(Color.WHITE, new Board, true, 0);
                          } else {
                              var gameByJoin: Game = new Game(Color.BLACK, new Board, false, 0);
                          }
                          gameByJoin.setFullCoordinates(result.board);
                          setCurrentGame(gameByJoin)
                          drawBoard(gameByJoin.board);
                          PromotionOverlay(currentGame.playerSide);
                          initializeClockSelf(result.userCountdownValue);
                          initializeClockOpp(result.userCountdownValue);
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
            let gameMode: number = -1
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
                    let m: number;
                    let s: number;
                    let minute = (document.getElementById('minute') as HTMLInputElement).value;
                    let second = (document.getElementById('second') as HTMLInputElement).value;
                    if (isNaN(parseInt(minute))) {
                        m = 0;
                    }else{
                        m = parseInt(minute);
                    }
                    if (isNaN(parseInt(second))) {
                        s = 0;
                    }else{
                        s = parseInt(second);
                    }
                    gameMode = m*60 + s;
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
                                  var gameByCreate: Game = new Game(Color.WHITE, new Board, true, 0);
                              } else {
                                  var gameByCreate: Game = new Game(Color.BLACK, new Board, false, 0);
                              }
                              gameByCreate.setFullCoordinates(result.board);
                              setCurrentGame(gameByCreate)
                              drawBoard(gameByCreate.board);
                              PromotionOverlay(currentGame.playerSide);
                              initializeClockSelf(result.userCountdownValue);
                              initializeClockOpp(result.userCountdownValue);
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