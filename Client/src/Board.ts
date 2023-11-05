import { Point } from "./Point"; 
import { Color } from "./Enum"; 
import { Knight } from "./Pieces/Knight";
import { Pawn } from "./Pieces/Pawn";
import { Rook } from "./Pieces/Rook";
import { Bishop } from "./Pieces/Bishop";
import { Queen } from "./Pieces/Queen";
import { King } from "./Pieces/King"; 

export class Board{
    boxes: Point[][]
    getBox(x: number, y: number): Point {
        if (x < 0 || x > 7 || y < 0 || y > 7) {
          throw new Error("Index out of bound");
        } 
        return this.boxes[x][y];
    }
    constructor(){
        this.boxes = []
        this.resetBoard()
    } 
    resetBoard() {
        this.boxes = []; // Khởi tạo mảng chính
    
        for (let r = 0; r < 8; r++) {
            this.boxes[r] = []; // Khởi tạo mảng con cho mỗi hàng
    
            for (let c = 0; c < 8; c++) {
                if (r === 7) {
                    if (c === 0 || c===7)
                        this.boxes[r][c] = new Point(r, c, new Rook(Color.BLACK, "./assets/Black-Rook.png","BR"));
                    else if(c === 1 || c === 6)
                        this.boxes[r][c] = new Point(r, c, new Knight(Color.BLACK, "./assets/Black-Knight.png","BN"));
                    else if(c === 2 || c === 5)
                        this.boxes[r][c] = new Point(r, c, new Bishop(Color.BLACK, "./assets/Black-Bishop.png","BB"));
                    else if(c === 3)
                        this.boxes[r][c] = new Point(r, c, new Queen(Color.BLACK, "./assets/Black-Queen.png","BQ"));
                    else if(c === 4)
                        this.boxes[r][c] = new Point(r, c, new King(Color.BLACK, "./assets/Black-King.png","BK"));
                    // else{

                    // }
                }else if (r === 0){
                    if (c === 0 || c===7)
                    // this.boxes[r][c] = new Point(r, c);
                        this.boxes[r][c] = new Point(r, c, new Rook(Color.WHITE, "./assets/White-Rook.png","WR"));
                    else if(c === 1 || c === 6)
                    // this.boxes[r][c] = new Point(r, c);
                        this.boxes[r][c] = new Point(r, c, new Knight(Color.WHITE, "./assets/White-Knight.png","WN"));
                    else if(c === 2 || c === 5)
                    // this.boxes[r][c] = new Point(r, c);
                        this.boxes[r][c] = new Point(r, c, new Bishop(Color.WHITE, "./assets/White-Bishop.png","WB"));
                    else if(c === 3)
                    // this.boxes[r][c] = new Point(r, c);
                        this.boxes[r][c] = new Point(r, c, new Queen(Color.WHITE, "./assets/White-Queen.png","WQ"));
                    else if(c === 4)
                    // this.boxes[r][c] = new Point(r, c);
                        this.boxes[r][c] = new Point(r, c, new King(Color.WHITE, "./assets/White-King.png","WK"));
                } 
                else if (r === 1)
                    this.boxes[r][c] = new Point(r, c, new Pawn(Color.WHITE, "./assets/White-Pawn.png","WP"));
                else if (r === 6)
                    // this.boxes[r][c] = new Point(r, c);
                    this.boxes[r][c] = new Point(r, c, new Pawn(Color.BLACK, "./assets/Black-Pawn.png","BP")); 
                else {
                    this.boxes[r][c] = new Point(r, c);
                }
            }
        }
    }
    
}