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
        //Nuoc di bat dau
        if(startPoint.row === 1 || startPoint.row === 6){
            if(startPoint.col === endPoint.col && (row === 2 || row === 1)) 
                return true
        }else{      
            //En passant
            //Nuoc di con lai
            if(startPoint.col === endPoint.col && row === 1) return true
        } 
        return false
        throw new Error("Method not implemented.");
    }

}