import { Piece } from "./Piece";   
import { Board } from "../Board";
import { Point } from "../Point";
import { Color } from "../Enum";

export class Bishop extends Piece{
    constructor(color: Color, image: string, name: string) 
    { 
        super(color,image,name); 
    }
    canMove(board: Board, startPoint: Point, endPoint: Point): boolean { 
        if(endPoint.piece && endPoint.piece.color === this.color){ 
            console.log("Bishop spy")
            return false
        }
        if(!this.isPathClear(board,startPoint,endPoint)){
            console.log("nhay coc")
            return false
        } 
        let row = Math.abs(startPoint.row - endPoint.row)
        let col = Math.abs(startPoint.col - endPoint.col)
        if(row === col) return true
        return false 
    }
    isPathClear(board: Board, startPoint: Point, endPoint: Point): boolean { 
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
        return true; // Đường đi không bị cản trở
    }

}