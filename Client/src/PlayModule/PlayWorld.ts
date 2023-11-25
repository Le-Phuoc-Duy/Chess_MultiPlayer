// Import Swal library (assuming you have it installed)
import { Color } from "../Enum";
import { PromotionOverlay, currentGame, drawBoard, setCurrentGame, stompClient } from "../Connect";
import { RoomJoinedResponse } from "../RoomJoinedResponse";
import { Game } from "../Game";
import Swal from 'sweetalert2';
import { Board } from '../Board';
document.getElementById("buttonPlay")?.addEventListener("click", async () => {
  if(localStorage.getItem('userID') == null){
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
  }else{
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
            cancelJoinGame().then(()=>{
              console.log("cancel");
            });
            
          });
        }
      },
    });
  
    // Thiết lập thời gian tự động đóng sau 20 giây
    loadingSwal.then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        cancelJoinGame().then(()=>{
          console.log("cancel");
        });
      }
    }); // 20 giây
  
    joinGame().then((result) => {
      if (result) {
        loadingSwal.close();
        console.log("done Task");
        Swal.fire({
          icon: 'success',
          title: 'Vào phòng thành công!',
        })
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
        let x: number = m * 60 + s
        gameMode = x;
        break;
    }
    stompClient.publish({
      destination: '/app/joinGame',
      headers: {},
      body: JSON.stringify({ idUserCreate: localStorage.getItem('userID'), mode: gameMode, userCreateTempPort: window.location.port }),
    });
    console.log("subscibe");
    stompClient.subscribe('/user/queue/createGameRoom', (message) => {
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

function cancelJoinGame(): Promise<String> {
  return new Promise((resolve) => {
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
        let x: number = m * 60 + s
        gameMode = x;
        break;
    }
    stompClient.publish({
      destination: '/app/cancelJoinGame',
      headers: {},
      body: JSON.stringify({ idUserCreate: localStorage.getItem('userID'), mode: gameMode, userCreateTempPort: window.location.port }),
    });

    stompClient.subscribe('/user/queue/cancelJoinGame', (message) => {
      const body = JSON.parse(message.body);
      console.log(body.toString());
      resolve(body);
    });
  });
}

