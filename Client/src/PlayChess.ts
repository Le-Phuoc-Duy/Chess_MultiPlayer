import Swal from "sweetalert2";
import type { Board } from "./Board";
import { Color } from "./Enum";
import { Game } from "./Game";
import { Self, Opponent } from "./Player"; 
// import { Client, StompSubscription } from '@stomp/stompjs';

var selected: Boolean= false
var startX: number = -1
var endX: number = -1
var startY: number = -1
var endY: number = -1
var p1: Self = new Self(Color.WHITE)            //Chua co socket => Tam thoi setting ban than la trang
var p2: Opponent = new Opponent(Color.BLACK)    //Chua co socket => Tam thoi setting ban than la den
var game: Game = new Game()

window.onload = function(){

    game.initialize(p1,p2)
    drawBoard(game.board)
} 

function drawBoard(board: Board) {
    //i row, j col
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let coordinate: string = i.toString()+j.toString()
            let divPiece = document.getElementById(coordinate)
            if(divPiece){
                divPiece.addEventListener("click",() => ClickPiece(i,j))
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
function ClickPiece(r: number, c: number){
    // console.log(r + c)
    // connect()
    if(selected){
        // console.log("secleted")
        if(game.playerMove(p1,startX,startY,r,c)){
            drawBoard(game.board)
            console.log(game.getFullCoordinates())
            // game.setFullCoordinates(startX,startY,r,c)
            // console.log("canmove"+ startX +startY +r + c)
            // send()
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

document.getElementById('testLoadBoardByString')?.addEventListener('click',() =>{ 
    console.log("/NB/KBNRPPPPPPPPR//Q//////////b/////////////////pppppppprn/qkbnr") 
    game.setFullCoordinates("/NB/KBNRPPPPPPPPR//Q//////////b/////////////////pppppppprn/qkbnr")
    drawBoard(game.board)
}) 