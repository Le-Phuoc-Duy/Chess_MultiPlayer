import { Piece } from "./Piece";   
import { Board } from "../Board";
import { Point } from "../Point";
import { Catsling, Color } from "../Enum";
export class King extends Piece{
    constructor(color: Color, image: string, name: string) 
    { 
        super(color,image,name); 
    }
    canMove(board: Board, startPoint: Point, endPoint: Point): boolean { 
        if(endPoint.piece && endPoint.piece.color === this.color){ 
            console.log("king spy")
            return false
        } 
        let row = Math.abs(startPoint.row - endPoint.row)
        let col = Math.abs(startPoint.col - endPoint.col)
        if((startPoint.row === endPoint.row && col === 1) || (startPoint.col === endPoint.col && row === 1)){
            board.kingMoved = false
            return true
        }
        else if(row === col && (row ===1 || col === 1)){
            board.kingMoved = false
            return true  
        }else if(startPoint.row === 7 && startPoint.col === 4       //Near White
                && startPoint.piece?.color === Color.WHITE
                && endPoint.row === 7 && endPoint.col === 6){
            if(board.kingMoved && board.rookNearKing){
                if(this.isPathClear(board,startPoint,endPoint)){
                    board.kingMoved = false
                    board.catsling = Catsling.NEAR
                    return true
                }
            } 
        }else if(startPoint.row === 7 && startPoint.col === 4       //Far White
                && startPoint.piece?.color === Color.WHITE
                && endPoint.row === 7 && (endPoint.col === 1 || endPoint.col === 2)){
            if(board.kingMoved && board.rookFarKing){
                if(this.isPathClear(board,startPoint,board.getBox(7,0))){
                    board.kingMoved = false
                    board.catsling = Catsling.FAR
                    return true
                }
            }  
        }
        else if(startPoint.row === 7 && startPoint.col === 3       //Near Black
                && startPoint.piece?.color === Color.BLACK
                && endPoint.row === 7 && endPoint.col === 1){
            if(board.kingMoved && board.rookNearKing){
                if(this.isPathClear(board,startPoint,endPoint)){
                    board.kingMoved = false
                    board.catsling = Catsling.NEAR
                    return true
                }
            }  
        }else if(startPoint.row === 7 && startPoint.col === 3       //Far Black
                && startPoint.piece?.color === Color.BLACK
                && endPoint.row === 7 && (endPoint.col === 6 || endPoint.col === 5)){
            if(board.kingMoved && board.rookNearKing){
                if(this.isPathClear(board,startPoint,board.getBox(7,7))){
                    board.kingMoved = false
                    board.catsling = Catsling.FAR
                    return true
                }
            }  
        }
        return false
    }
    isPathClear(board: Board, startPoint: Point, endPoint: Point): boolean {
        // const direction = startPoint.col < endPoint.col ? 1 : -1;  
        //Vì King chỉ bắt nhảy cóc khi nhập thành nên chỉ lấy tọa độ col
        let direction
        if(startPoint.col < endPoint.col) direction = 1
        else if(startPoint.col > endPoint.col) direction = -1
        else direction = 0

        let col = startPoint.col + direction
        while (col !== endPoint.col){ 
            if (board.getBox(startPoint.row,col).piece !== null) {
                if (col === endPoint.col) return true
                return false; // Có quân cờ nằm giữa đường đi
            }
            col += direction
        }
        return true; // Đường đi không bị cản trở 
    }

}