import { Piece } from "./Piece";   
import { Board } from "../Board";
import { Point } from "../Point";
import { Color } from "../Enum";

export class Rook extends Piece{
    constructor(color: Color, image: string, name: string) 
    { 
        super(color,image,name); 
    }
    canMove(board: Board, startPoint: Point, endPoint: Point): boolean {  
        if(endPoint.piece && endPoint.piece.color === this.color){ 
            console.log("rook spy")
            return false
        }
        if(!this.isPathClear(board,startPoint,endPoint)){
            console.log("nhay coc")
            return false
        } 
        //Nuoc di binh thuong
        if(startPoint.row === endPoint.row || startPoint.col === endPoint.col){
            if (startPoint.col === 0 && startPoint.piece?.color === Color.WHITE)
                board.rookFarKing = false
            if (startPoint.col === 7 && startPoint.piece?.color === Color.WHITE)
                board.rookNearKing = false
            if (startPoint.col === 0 && startPoint.piece?.color === Color.BLACK)
                board.rookNearKing = false
            if (startPoint.col === 7 && startPoint.piece?.color === Color.BLACK)
                board.rookFarKing = false

            return true 
        } 
        return false 
    }
    isPathClear(board: Board, startPoint: Point, endPoint: Point): boolean {
        if (startPoint.row === endPoint.row) {
            const direction = startPoint.col < endPoint.col ? 1 : -1; 
            let col = startPoint.col + direction
            while (col !== endPoint.col){ 
                if (board.getBox(startPoint.row,col).piece !== null) {
                    if (col === endPoint.col) return true
                    return false; // Có quân cờ nằm giữa đường đi
                }
                col += direction
            }
            return true; // Đường đi không bị cản trở
        } else if (startPoint.col === endPoint.col) {
            const direction = startPoint.row < endPoint.row ? 1 : -1; 
            let row = startPoint.row + direction
            while(row !== endPoint.row){ 
                if (board.getBox(row,startPoint.col).piece !== null) {
                    if (row === endPoint.row) return true
                    return false; // Có quân cờ nằm giữa đường đi
                }
                row += direction
            }
            return true; // Đường đi không bị cản trở
        }

        return false; // Đường đi không phải theo hàng hoặc cột
    }

}