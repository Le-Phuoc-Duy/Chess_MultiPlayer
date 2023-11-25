import { Piece } from "./Piece";   
import { Board } from "../Board";
import { Point } from "../Point";
import { Color } from "../Enum";

export class Pawn extends Piece{
    constructor(color: Color, image: string, name: string) 
    { 
        super(color,image,name); 
    }
    canMove(board: Board, startPoint: Point, endPoint: Point): boolean { 
        if(endPoint.piece && endPoint.piece.color === this.color){ 
            console.log("pawn spy")
            return false
        }
        
        let row: number = Math.abs(endPoint.row - startPoint.row)
        let col: number = Math.abs(endPoint.col - startPoint.col) 
        if(endPoint.row > startPoint.row){
            console.log("di nguoc chieu")
            return false
        }
        if(col === 1 && row === 1){     //Đi chéo  
            if(!board.getBox(endPoint.row, endPoint.col).piece){
                console.log("khong di cheo duoc")
                return false
            }else return true
        }else if(endPoint.col === startPoint.col){      //Đi thẳng
            if(startPoint.row === 6){                   // Hàng cho phép di chuyển 2 nước
                if(row === 1){                          // Di chuyển 1 nước
                    if(!board.getBox(endPoint.row, endPoint.col).piece){
                        console.log("khong co quan tren 1 nc")
                        return true
                    }
                    else{
                        console.log("co quan phia tren 6")
                        return false
                    }
                }
                else if(row === 2){
                    if(this.isPathClear(board,startPoint,endPoint)) return true
                    else{
                        console.log("nhay coc")
                        return false
                    }
                }
            }else{                                          // Các hàng khác
                if(row === 1){
                    if(!board.getBox(endPoint.row, endPoint.col).piece){
                        console.log("khong co quan tren 1 nc")
                        return true
                    }
                    else{
                        console.log("co quan phia tren")
                        return false
                    }
                }else{
                    console.log("di qua so nuoc")
                    return false
                }
            }
        }
        return false 
    }
    isPathClear(board: Board, startPoint: Point, endPoint: Point): boolean {
        if(board.getBox(endPoint.row,endPoint.col).piece) return false
        // const direction = startPoint.row < endPoint.row ? 1 : -1; 

        let direction
        if(startPoint.row < endPoint.row) direction = 1
        else if(startPoint.row > endPoint.row) direction = -1
        else direction = 0

        let row = startPoint.row + direction
        while(row !== endPoint.row){
            if (board.getBox(row,startPoint.col).piece !== null) {
                return false; // Có quân cờ nằm giữa đường đi
            }
            row += direction
        }
        return true; // Đường đi không bị cản trở 
    }
    

}