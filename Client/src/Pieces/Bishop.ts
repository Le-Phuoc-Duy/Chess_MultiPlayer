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
        let row = Math.abs(startPoint.row - endPoint.row)
        let col = Math.abs(startPoint.col - endPoint.col)
        if(row === col) return true
        return false
        throw new Error("Method not implemented.");
    }

}