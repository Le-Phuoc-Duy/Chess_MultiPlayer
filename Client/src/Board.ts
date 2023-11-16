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
                        this.boxes[r][c] = new Point(r, c, new Rook(Color.BLACK, "./assets/Black-Rook.png","r"));
                    else if(c === 1 || c === 6)
                        this.boxes[r][c] = new Point(r, c, new Knight(Color.BLACK, "./assets/Black-Knight.png","n"));
                    else if(c === 2 || c === 5)
                        this.boxes[r][c] = new Point(r, c, new Bishop(Color.BLACK, "./assets/Black-Bishop.png","b"));
                    else if(c === 3)
                        this.boxes[r][c] = new Point(r, c, new Queen(Color.BLACK, "./assets/Black-Queen.png","q"));
                    else if(c === 4)
                        this.boxes[r][c] = new Point(r, c, new King(Color.BLACK, "./assets/Black-King.png","k"));
                    // else{

                    // }
                }else if (r === 0){
                    if (c === 0 || c===7)
                    // this.boxes[r][c] = new Point(r, c);
                        this.boxes[r][c] = new Point(r, c, new Rook(Color.WHITE, "./assets/White-Rook.png","R"));
                    else if(c === 1 || c === 6)
                    // this.boxes[r][c] = new Point(r, c);
                        this.boxes[r][c] = new Point(r, c, new Knight(Color.WHITE, "./assets/White-Knight.png","N"));
                    else if(c === 2 || c === 5)
                    // this.boxes[r][c] = new Point(r, c);
                        this.boxes[r][c] = new Point(r, c, new Bishop(Color.WHITE, "./assets/White-Bishop.png","B"));
                    else if(c === 3)
                    // this.boxes[r][c] = new Point(r, c);
                        this.boxes[r][c] = new Point(r, c, new Queen(Color.WHITE, "./assets/White-Queen.png","Q"));
                    else if(c === 4)
                    // this.boxes[r][c] = new Point(r, c);
                        this.boxes[r][c] = new Point(r, c, new King(Color.WHITE, "./assets/White-King.png","K"));
                } 
                else if (r === 1)
                    this.boxes[r][c] = new Point(r, c, new Pawn(Color.WHITE, "./assets/White-Pawn.png","P"));
                else if (r === 6)
                    // this.boxes[r][c] = new Point(r, c);
                    this.boxes[r][c] = new Point(r, c, new Pawn(Color.BLACK, "./assets/Black-Pawn.png","p")); 
                else {
                    this.boxes[r][c] = new Point(r, c);
                }
            }
        }
    }
    setBoard(coordinateString: String){
        this.boxes = []; 
        for (let r = 0; r < 8; r++) {
            this.boxes[r] = [];

            for (let c = 0; c < 8; c++) {
                const index = r * 8 + c;
                const pieceCode = coordinateString.charAt(index);

                switch (pieceCode) {
                    case 'R': 
                        this.boxes[r][c] = new Point(r, c, new Rook(Color.WHITE, "./assets/White-Rook.png","R"));
                        break;
                    case 'N':
                        this.boxes[r][c] = new Point(r, c, new Knight(Color.WHITE, "./assets/White-Knight.png","N"));
                        break;
                    case 'B': 
                        this.boxes[r][c] = new Point(r, c, new Bishop(Color.WHITE, "./assets/White-Bishop.png","B"));
                        break;
                    case 'Q':
                        this.boxes[r][c] = new Point(r, c, new Queen(Color.WHITE, "./assets/White-Queen.png","Q"));
                        break;
                    case 'K': 
                        this.boxes[r][c] = new Point(r, c, new King(Color.WHITE, "./assets/White-King.png","K"));
                        break;
                    case 'P':
                        this.boxes[r][c] = new Point(r, c, new Pawn(Color.WHITE, "./assets/White-Pawn.png","P"));
                        break; 
                    case 'r': 
                        this.boxes[r][c] = new Point(r, c, new Rook(Color.BLACK, "./assets/Black-Rook.png","r"));
                        break;
                    case 'n':
                        this.boxes[r][c] = new Point(r, c, new Knight(Color.BLACK, "./assets/Black-Knight.png","n"));
                        break;
                    case 'b': 
                        this.boxes[r][c] = new Point(r, c, new Bishop(Color.BLACK, "./assets/Black-Bishop.png","b"));
                        break;
                    case 'q':
                        this.boxes[r][c] = new Point(r, c, new Queen(Color.BLACK, "./assets/Black-Queen.png","q"));
                        break;
                    case 'k': 
                        this.boxes[r][c] = new Point(r, c, new King(Color.BLACK, "./assets/Black-King.png","k"));
                        break;
                    case 'p':
                        this.boxes[r][c] = new Point(r, c, new Pawn(Color.BLACK, "./assets/Black-Pawn.png","p"));
                        break; 
                    default:
                        this.boxes[r][c] = new Point(r, c);
                        break;
                }
            }
        }
    }
    
}