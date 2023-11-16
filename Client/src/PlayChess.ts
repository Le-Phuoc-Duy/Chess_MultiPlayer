import {Opponent, Self} from "./Player";
import {Color, GameStatus} from "./Enum";
import {Game} from "./Game";
import {Board} from "./Board";  
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