import { Color } from "../Enum";
import { PromotionOverlay, currentGame, drawBoard, setCurrentGame, stompClient, initializeClockSelf, initializeClockOpp } from "../Connect";
import { RoomJoinedResponse } from "../RoomJoinedResponse";
import { Game } from "../Game";
import Swal from 'sweetalert2';
import { Board } from '../Board';
document.getElementById("buttonPlay")?.addEventListener("click", async () => {
  if (localStorage.getItem('userID') == null) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: "Đăng nhập để có thể chơi!"
    });
  } else {
    const loadingSwal = Swal.fire({
      title: 'Đang tìm kiếm người chơi...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      timer: 20000,
      didOpen: () => {
        Swal.showLoading();
        // Bắt sự kiện cho nút Cancel
        const cancelButton = Swal.getCancelButton();
        if (cancelButton) {
          cancelButton.addEventListener('click', () => {
            cancelJoinGame().then(() => {
            });

          });
        }
      },
    });

    // Thiết lập thời gian tự động đóng sau 20 giây
    loadingSwal.then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        cancelJoinGame().then(() => {
        });
      }
    }); // 20 giây

    joinGame().then((result) => {
      if (result) {
        loadingSwal.close();
        Swal.fire({
          icon: 'success',
          title: 'Vào phòng thành công!',
        })
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
      .catch((error) => {
        Swal.fire({
          icon: "error",
          text: "Vào phòng thất bại",
        })
      });
  }

});


function joinGame(): Promise<RoomJoinedResponse> {
  return new Promise((resolve) => {
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
    stompClient.publish({
      destination: '/app/joinGame',
      headers: {},
      body: JSON.stringify({ idUserCreate: localStorage.getItem('userID'), mode: gameMode}),
    });
    stompClient.subscribe('/user/queue/createGameRoom', (message) => {
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

function cancelJoinGame(): Promise<String> {
  return new Promise((resolve) => {
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
        } else {
          m = parseInt(minute);
        }
        if (isNaN(parseInt(second))) {
          s = 0;
        } else {
          s = parseInt(second);
        }
        gameMode = m * 60 + s;
        break;
    }
    stompClient.publish({
      destination: '/app/cancelJoinGame',
      headers: {},
      body: JSON.stringify({ idUserCreate: localStorage.getItem('userID'), mode: gameMode}),
    });

    stompClient.subscribe('/user/queue/cancelJoinGame', (message) => {
      const body = JSON.parse(message.body);
      resolve(body);
    });
  });
}

