import { Piece } from "./Piece";   
import { Board } from "../Board";
import { Point } from "../Point";
import { Color } from "../Enum";

export class Queen extends Piece{
    constructor(color: Color, image: string, name: string) 
    { 
        super(color,image,name); 
    }
    canMove(board: Board, startPoint: Point, endPoint: Point): boolean { 
        if(endPoint.piece && endPoint.piece.color === this.color){ 
            console.log("Queen spy")
            return false
        } 
        if(!this.isPathClear(board,startPoint,endPoint)){
            console.log("nhay coc")
            return false
        } 
        if(startPoint.row === endPoint.row || startPoint.col === endPoint.col)
            return true
        else if(Math.abs(startPoint.row - endPoint.row) === Math.abs(startPoint.col - endPoint.col)) 
            return true  
        
        return false 
    }
    isPathClear(board: Board, startPoint: Point, endPoint: Point): boolean {
        // Đi theo row
        if (startPoint.row === endPoint.row) {
            const direction = startPoint.col < endPoint.col ? 1 : -1; 
            let col = startPoint.col + direction
            while (col !== endPoint.col){
                if (board.getBox(startPoint.row,col).piece !== null) {
                    if(col === endPoint.col) return true
                    return false; // Có quân cờ nằm giữa đường đi
                }
                col += direction
            }
            return true; // Đường đi không bị cản trở
        } else if (startPoint.col === endPoint.col) {       // Đi theo col
            const direction = startPoint.row < endPoint.row ? 1 : -1; 
            let row = startPoint.row + direction
            while(row !== endPoint.row){
                if (board.getBox(row,startPoint.col).piece !== null) {
                    if(row === endPoint.row) return true
                    return false; // Có quân cờ nằm giữa đường đi
                }
                row += direction
            }
            return true; // Đường đi không bị cản trở
        }else{                                              // Đi chéo
            // let rowDirection = startPoint.row < endPoint.row ? 1 : -1;
            // let colDirection = startPoint.col < endPoint.col ? 1 : -1;
            let rowDirection
            let colDirection
            if(startPoint.row < endPoint.row) rowDirection = 1
            else if(startPoint.row > endPoint.row) rowDirection = -1
            else rowDirection = 0
    
            if(startPoint.col < endPoint.col) colDirection = 1
            else if(startPoint.col > endPoint.col) colDirection = -1
            else colDirection = 0

            let row = startPoint.row + rowDirection;
            let col = startPoint.col + colDirection;

            while (row !== endPoint.row && col !== endPoint.col) {
                if (board.getBox(row,col).piece !== null) {
                    if (row === endPoint.row && col === endPoint.col) return true
                    return false; // Có quân cờ nằm giữa đường đi
                }
                row += rowDirection;
                col += colDirection;
            }
            return true;
        }

        return false;
    }
}