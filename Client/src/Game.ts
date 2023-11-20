import { Board } from "./Board";
import { Color, GameStatus } from "./Enum";
import { Move } from "./Move";
import { Point } from "./Point";
import { Piece } from "./Pieces/Piece"; 
export class Game {
	private _playerSide: Color				//Người chơi, trắng hoặc đen
	private _board: Board 
	private _currentTurn: boolean  			//Lượt chơi, true có thể đánh, false lượt của đối thủ
	private _status: GameStatus  			//Trạng thái trận 

	constructor(playerSide: Color){
		this._playerSide = playerSide
		this._board = new Board()
		if (playerSide === Color.WHITE ){
			console.log("white la p1")
			this._currentTurn = true 
		}else{
			console.log("white la p2")
			this._currentTurn = false 
		} 
		this._status = GameStatus.ACTIVE
	}

	public get currentTurn(): boolean {
		return this._currentTurn;
	}
	public set currentTurn(value: boolean) {
		this._currentTurn = value;
	} 
	
	public get board(): Board {
		return this._board;
	}
	public set board(value: Board) {
		this._board = value;
	} 
	public get status(): GameStatus {
		return this._status;
	}
	public set status(value: GameStatus) {
		this._status = value;
	}
	isEnd(): boolean
	{
		return this._status != GameStatus.ACTIVE;
	}
	// Lấy tọa độ full bàn cờ
	getFullCoordinates() : string{
		let fullCoordinates: string = ""
		for (let r = 0; r < 8; r++){
			for(let c = 0; c < 8; c++){
				if(this.board.getBox(r,c).piece?.name)
					fullCoordinates += this.board.getBox(r,c).piece?.name
				else
					fullCoordinates += "/"
			}
		}
		return fullCoordinates
	} 
	//Set tọa độ full bàn cờ
	setFullCoordinates(fullCoordinates: String){ 
		this._board.setBoard(fullCoordinates)
	} 
	playerMove(startX: number,startY: number,endX: number,endY: number) : boolean
	{
		let startBox: Point			//Ô bắt đầu di chuyển
		let endBox: Point			//Ô kết thúc di chuyển
		startBox = this._board.getBox(startX,startY)
		endBox = this._board.getBox(endX,endY)

		let move: Move = new Move(startBox,endBox)
		return this.makeMove(move);
	}
	private makeMove(move: Move) : boolean
	{

		let sourcePiece: Piece | null			//Quân cờ di chuyển
		sourcePiece = move.startPoint.piece
		console.log("img " + sourcePiece?.image + move.startPoint.row + move.startPoint.col )
		//Không chọn quân cờ, chọn ô cờ
		if (sourcePiece === null) {
			console.log("sourcePiece")
			return false;
		}
		//Chưa tới lượt
		if (!this._currentTurn) {
			console.log("chua toi luot")
			return false;
		}
		//Chơi quân đối thủ
		if (sourcePiece.color !== this._playerSide) {
			console.log("khong the choi quan cua doi thu") 
			return false;
		}
		//Nước cờ có đúng logic không?
		if (!sourcePiece.canMove(this._board, move.startPoint, move.endPoint)) {
			console.log("invalid move " +  move.startPoint.row + move.startPoint.col)
			console.log("invalid move " +  move.endPoint.row + move.endPoint.col)
			return false
		}
		//Ăn quân
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
		this._currentTurn = false 
		return true;
	}
} 