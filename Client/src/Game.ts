import { Self, Opponent, Player } from "./Player";
import { Board } from "./Board";
import { Color, GameStatus } from "./Enum";
import { Move } from "./Move";
import { Point } from "./Point"; 
import { Piece } from "./Pieces/Piece";
export class Game { 
    private _players: Player[] = []
    private _board: Board = new Board()
    private _currentTurn: Player = this._players[0]
    private _status: GameStatus = GameStatus.ACTIVE
    private _movesPlayed: Move[] = []  
    // private _players: Player[]
    // private _board: Board 
    // private _currentTurn: Player
    // private _status: GameStatus 
    // private _movesPlayed: Move[] 
	// constructor(player1: Player,player2: Player, board: Board, status: GameStatus, movesPlay: Move){
	// 	this._players.push(player1)
	// 	this._players.push(player2)
	// 	this._board = board
	// 	this._currentTurn = player1
	// 	this._status = status
	// 	this._movesPlayed.push(movesPlay)
	// } 
	public get board(): Board {
		return this._board;
	}
	public set board(value: Board) {
		this._board = value;
	}
	getFullCoordinates() : string{
		let fullCoordinates: string = ""
		for (let r = 0; r < 8; r++){
			for(let c = 0; c < 8; c++){ 
				if(this.board.getBox(r,c).piece?.name)
					fullCoordinates += this.board.getBox(r,c).piece?.name
				else 
					fullCoordinates += "nn"
			}
			fullCoordinates += "/"
		}

		return fullCoordinates
	}
	// setFullCoordinates(startX: number,startY: number,endX: number,endY: number){
	// 	this.board.getBox(endX,endY).piece = this.board.getBox(startX,startY).piece
	// 	this.board.getBox(startX,startY).piece = null 
	// }
	setFullCoordinates(fullCoordinates: String){
		// this.board.getBox(endX,endY).piece = this.board.getBox(startX,startY).piece
		// this.board.getBox(startX,startY).piece = null 
		this._board.setBoard(fullCoordinates)
	}
	initialize(p1: Player,p2: Player) 
	{ 
		this._players[0] = p1 
		this._players[1] = p2 
		this._board.resetBoard()
		if (p1.color === Color.WHITE ){
			console.log("white la p1")
			this._currentTurn = p1
			// this._players[0] = p1 
			// this._players[1] = p2 
		}else{
			console.log("white la p2")
			this._currentTurn = p2
			// this._players[0] = p1 
			// this._players[1] = p2 			
		} 
		// if (p1.isWhiteSide()) { 
		// 	this._currentTurn = p1; 
		// } 
		// else { 
		// 	this._currentTurn = p2; 
		// } 
        this._movesPlayed.splice(0,this._movesPlayed.length)
	} 
	isEnd(): boolean 
	{ 
		return this._status != GameStatus.ACTIVE; 
	} 
    public get status(): GameStatus {
        return this._status;
    }
    public set status(value: GameStatus) {
        this._status = value;
    } 
	playerMove(player: Player,startX: number,startY: number,endX: number,endY: number) : boolean
	{ 
        let startBox: Point 
        let endBox: Point
        startBox = this._board.getBox(startX,startY)
        endBox = this._board.getBox(endX,endY)
        
        let move: Move = new Move(player,startBox,endBox)  
		return this.makeMove(move, player); 
	} 
	makeMove(move: Move, player: Player) : boolean
	{ 
		
        let sourcePiece: Piece | null 
        sourcePiece = move.startPoint.piece
        console.log("img " + sourcePiece?.image + move.startPoint.row + move.startPoint.col )
		if (sourcePiece === null) { 
			console.log("sourcePiece")
			return false; 
		} 
		// valid player 
		if (player !== this._currentTurn) { 
			console.log("chua toi luot")
			return false; 
		} 
		if (sourcePiece.color !== player.color) { 
			console.log("khong the choi quan cua doi thu")
			if (sourcePiece.color === Color.WHITE)
				console.log("source piece: trang")
			else console.log("source piece: den")
			if (player.color === Color.WHITE)
				console.log("player: trang")
			else console.log("player: den")
			return false; 
		} 
		// valid move? 
		if (!sourcePiece.canMove(this._board, move.startPoint, move.endPoint)) { 
			console.log("valid move ")
			return false
		}  
		// kill? 
		let destPiece: Piece | null
        destPiece = move.startPoint.piece
		if (destPiece !== null) { 
            destPiece.killed = true 
            move.pieceKilled = destPiece
		} 
		// castling? 
		// if (sourcePiece != null && sourcePiece instanceof King 
		// 	&& sourcePiece.isCastlingMove()) { 
		// 	move.setCastlingMove(true); 
		// } 
		// store the move 
		this._movesPlayed.push(move); 
		// move piece from the stat box to end box 
		// move.getEnd().setPiece(move.getStart().getPiece()); 
		// move.getStart.setPiece(null);   
        
        move.endPoint.piece = move.startPoint.piece 
        move.startPoint.piece = null
		// if (destPiece != null && destPiece instanceof King) { 
		// 	if (player.isWhiteSide()) { 
		// 		this.setStatus(GameStatus.WHITE_WIN); 
		// 	} 
		// 	else { 
		// 		this.setStatus(GameStatus.BLACK_WIN); 
		// 	} 
		// } 
		// set the current turn to the other player 
		if (this._currentTurn === this._players[0]) { 
			this._currentTurn = this._players[1]; 
		} 
		else { 
			this._currentTurn = this._players[0]; 
		} 
		return true; 
	}  
} 