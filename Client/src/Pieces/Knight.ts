import { Piece } from "./Piece";   
import { Board } from "../Board";
import { Point } from "../Point";
import { Color } from "../Enum";

export class Knight extends Piece{
    constructor(color: Color, image: string, name: string) 
    { 
        super(color,image,name); 
    }
    canMove(board: Board, startPoint: Point, endPoint: Point): boolean { 
        if(endPoint.piece && endPoint.piece.color === this.color){ 
            console.log("knight spy")
            return false
        }
        let col: number = Math.abs(startPoint.col - endPoint.col)
        let row: number = Math.abs(startPoint.row - endPoint.row)
        return row*col === 2
        throw new Error("Method not implemented.");
    }
    isPathClear(board: Board, startPoint: Point, endPoint: Point): boolean { return true}

}