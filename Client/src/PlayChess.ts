import {Opponent, Self} from "./Player";
import {Color, GameStatus} from "./Enum";
import {Game} from "./Game";
import {Board} from "./Board";
import { createChessMove, sendchessMove } from "./main";
import { RoomJoinedResponse } from './RoomJoinedResponse';
var selected: Boolean= false
var startX: number = -1
var endX: number = -1
var startY: number = -1
var endY: number = -1
// export var p1: Self = new Self(Color.WHITE)            //Chua co socket => Tam thoi setting ban than la trang
// export var p2: Opponent = new Opponent(Color.BLACK)    //Chua co socket => Tam thoi setting ban than la den
// export var game: Game = new Game()
// window.onload = function(){
//     if(currentGame.status === GameStatus.ACTIVE){
//         drawBoard(currentGame.board,currentGame)
//     }
// }
export function drawBoard(game: Game) {
  //i row, j col
  let board: Board = game.board
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let coordinate: string = i.toString()+j.toString()
      let divPiece = document.getElementById(coordinate)
      if(divPiece){
        divPiece.addEventListener("click",() => ClickPiece(i,j,game))
        let imgPiece = document.getElementById("i" + coordinate)  as HTMLImageElement
        if(board.getBox(i,j).piece?.image)
          imgPiece.src = board.getBox(i,j).piece!.image
        else if(imgPiece){
          imgPiece.src = ""
        }
      }
    }
  }
}
//Chi ap dung cho self, khong ap dung cho opponent
function ClickPiece(r: number, c: number, game: Game){
  // console.log(r + c)
  // connect()
  if(selected){
    // console.log("secleted")
    if(game.playerMove(game.getPlayer,startX,startY,r,c)){
      drawBoard(game)
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
      
      if(localStorage.getItem('color') == "true"){
         color = true;
      }else{
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
    console.log('iDUserSend from localStorage: ' + localStorage.getItem('iDUserSend'));
    console.log('iDUserReceive from localStorage: ' + localStorage.getItem('iDUserReceive'));
    console.log('iDRoom from localStorage: ' + localStorage.getItem('iDRoom'));
    console.log('idRoomUser from localStorage: ' + localStorage.getItem('idRoomUser'));
    console.log('chessMove from localStorage: ' + localStorage.getItem('chessMove'));
    console.log('board from localStorage: ' + board);
    console.log('color from localStorage: ' + localStorage.getItem('color'));
    console.log('userSendTempPort from localStorage: ' + localStorage.getItem('userSendTempPort'));
    console.log('userReceiveTempPort from localStorage: ' + localStorage.getItem('userReceiveTempPort'));
      createChessMove(CreateChessMove);
      // game.setFullCoordinates(startX,startY,r,c)
      // console.log("canmove"+ startX +startY +r + c)
      // send()
    }else{
      // console.log("cantmove"+ startX +startY + +r + c)
    }
    selected = false
    startX = -1
    startY = -1
    endX = -1
    endY = -1
  }else{
    // console.log("!secleted")
    selected = true
    startX = r //parseInt(coordinates.charAt(0))
    startY = c //parseInt(coordinates.charAt(1))
  }
}