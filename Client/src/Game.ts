import { Board } from "./Board";
import { Catsling, Color, GameStatus } from "./Enum";
import { Point } from "./Point";
import { Piece } from "./Pieces/Piece"; 
import { Queen } from "./Pieces/Queen";
import { Knight } from "./Pieces/Knight";
import { Bishop } from "./Pieces/Bishop";
import { Rook } from "./Pieces/Rook"; 
import { Pawn } from "./Pieces/Pawn";
import { PromotionOverlay, gameStatusAlert, piecePromoted, sendEndGame } from "./Connect";
import { EndGame } from "./EndGame";
export class Game {
	private _playerSide: Color				//Người chơi, trắng hoặc đen
	private _board: Board 
	private _currentTurn: boolean  			//Lượt chơi, true có thể đánh, false lượt của đối thủ
	private _status: GameStatus  			//Trạng thái trận  
	public get currentTurn(): boolean {
		return this._currentTurn;
	}
	public set currentTurn(value: boolean) {
		this._currentTurn = value;
		if(this._currentTurn){
			localStorage.setItem('currentTurn','true');
			}else{
				localStorage.setItem('currentTurn','false');
			}
	}
	public get playerSide(): Color {
		return this._playerSide;
	}
	public set playerSide(value: Color) {
		this._playerSide = value;
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
	isEnd(): boolean {
		return this._status != GameStatus.ACTIVE;
	}
	// Lấy tọa độ full bàn cờ
	getFullCoordinates(): string {
		let fullCoordinates: string = ""
		for (let r = 0; r < 8; r++) {
			for (let c = 0; c < 8; c++) {
				if (this.board.getBox(r, c).piece?.name)
					fullCoordinates += this.board.getBox(r, c).piece?.name
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
		startBox = this._board.getBox(startX, startY)
		endBox = this._board.getBox(endX, endY)
		let move = this.makeMove(startBox, endBox)
		if (move) this._currentTurn = true
		return move
	}
	private makeMove(startPoint: Point, endPoint: Point): boolean {
		let sourcePiece: Piece | null			//Quân cờ di chuyển
		let chkPromotion: boolean = false
		sourcePiece = startPoint.piece
		console.log("img " + sourcePiece?.image + startPoint.row + startPoint.col)
		//Ván cờ đã kết thúc?
		// if(this._status !== GameStatus.ACTIVE){
		// 	console.log("Ván cờ đã kết thúc")
		// 	return false;
		// }	
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
		if (!sourcePiece.canMove(this._board, startPoint, endPoint)) {
			console.log("invalid move " + startPoint.row + startPoint.col)
			console.log("invalid move " + endPoint.row + endPoint.col)
			return false
		}
		//Catsling?
		// if (this._board.catsling === Catsling.DONE) console.log("catsle done ")
		// if (this._board.catsling === Catsling.FAR) console.log("catsle.FAR ")
		// if (this._board.catsling === Catsling.NEAR) console.log("catsle NEAR ")
		// if (this._board.catsling === Catsling.NOT) console.log("catslNOT   ")
		let startBoxRook; let endBoxRook;let tmpRookEnd
		if (this.board.catsling === Catsling.NEAR && sourcePiece.color === Color.WHITE) {
			if (this._board.getBox(7, 7).piece?.name !== 'R') {
				this._board.kingMoved = true
				this.board.catsling = Catsling.NOT
				this._board.rookNearKing = false
				return false			//Chưa nhập thành nhưng quân xe đã bị ăn
			}
			if (this.isInCheck()) {
				this._board.rookNearKing = true
				this._board.kingMoved = true
				this.board.catsling = Catsling.NOT
				return false			//Đang chiếu không cho nhập thành
			}
			startBoxRook = this._board.getBox(7, 7)
			endBoxRook = this._board.getBox(7, 5)
			//Move rook
			tmpRookEnd = endBoxRook.piece
			this._board.getBox(endBoxRook.row, endBoxRook.col).piece = this._board.getBox(startBoxRook.row, startBoxRook.col).piece
			this._board.getBox(startBoxRook.row, startBoxRook.col).piece = null

			this.board.catsling = Catsling.EXCUTE
		}
		if (this.board.catsling === Catsling.FAR && sourcePiece.color === Color.WHITE) {
			if (this._board.getBox(7, 0).piece?.name !== 'R') {
				this._board.kingMoved = true
				this.board.catsling = Catsling.NOT
				this._board.rookFarKing = false
				return false			//Chưa nhập thành nhưng quân xe đã bị ăn
			}
			if (this.isInCheck()) {
				this._board.rookFarKing = true
				this._board.kingMoved = true
				this.board.catsling = Catsling.NOT
				return false			//Đang chiếu không cho nhập thành
			}
			startBoxRook = this._board.getBox(7, 0)
			endBoxRook = this._board.getBox(7, 3)
			//Move rook
			tmpRookEnd = endBoxRook.piece
			this._board.getBox(endBoxRook.row, endBoxRook.col).piece = this._board.getBox(startBoxRook.row, startBoxRook.col).piece
			this._board.getBox(startBoxRook.row, startBoxRook.col).piece = null

			endPoint = this._board.getBox(7, 2)
			this.board.catsling = Catsling.EXCUTE
		}
		if (this.board.catsling === Catsling.NEAR && sourcePiece.color === Color.BLACK) {
			if (this._board.getBox(7, 0).piece?.name !== 'r') {
				this._board.kingMoved = true
				this.board.catsling = Catsling.NOT
				this._board.rookNearKing = false
				return false			//Chưa nhập thành nhưng quân xe đã bị ăn
			}
			if (this.isInCheck()) {
				this._board.rookNearKing = true
				this._board.kingMoved = true
				this.board.catsling = Catsling.NOT
				return false			//Đang chiếu không cho nhập thành
			}

			startBoxRook = this._board.getBox(7, 0)
			endBoxRook = this._board.getBox(7, 2)
			//Move rook
			tmpRookEnd = endBoxRook.piece
			this._board.getBox(endBoxRook.row, endBoxRook.col).piece = this._board.getBox(startBoxRook.row, startBoxRook.col).piece
			this._board.getBox(startBoxRook.row, startBoxRook.col).piece = null

			this.board.catsling = Catsling.EXCUTE
		}
		if (this.board.catsling === Catsling.FAR && sourcePiece.color === Color.BLACK) {
			if (this._board.getBox(7, 7).piece?.name !== 'r') {
				this._board.kingMoved = true
				this.board.catsling = Catsling.NOT
				this._board.rookFarKing = false
				return false			//Chưa nhập thành nhưng quân xe đã bị ăn
			}
			if (this.isInCheck()) {
				this._board.rookFarKing = true
				this._board.kingMoved = true
				this.board.catsling = Catsling.NOT
				return false			//Đang chiếu không cho nhập thành
			}
			startBoxRook = this._board.getBox(7, 7)
			endBoxRook = this._board.getBox(7, 4)
			//Move rook
			tmpRookEnd = endBoxRook.piece
			this._board.getBox(endBoxRook.row, endBoxRook.col).piece = this._board.getBox(startBoxRook.row, startBoxRook.col).piece
			this._board.getBox(startBoxRook.row, startBoxRook.col).piece = null

			endPoint = this._board.getBox(7, 5)
			this.board.catsling = Catsling.EXCUTE
		}
		//Promotion?
		if (endPoint.row === 0 && (this._board.getBox(startPoint.row, startPoint.col).piece?.name === 'p' || this._board.getBox(startPoint.row, startPoint.col).piece?.name === 'P')) {
			console.log("piece promote" + piecePromoted)
			if (this._playerSide === Color.WHITE) {
				if (piecePromoted === "Queen") {
					this._board.getBox(startPoint.row, startPoint.col).piece = new Queen(Color.WHITE, "./assets/White-Queen.png", "Q")
					chkPromotion = true
				}
				if (piecePromoted === "Knight") {
					this._board.getBox(startPoint.row, startPoint.col).piece = new Knight(Color.WHITE, "./assets/White-Knight.png", "N")
					chkPromotion = true
				}
				if (piecePromoted === "Bishop") {
					this._board.getBox(startPoint.row, startPoint.col).piece = new Bishop(Color.WHITE, "./assets/White-Bishop.png", "B")
					chkPromotion = true
				}
				if (piecePromoted === "Rook") {
					this._board.getBox(startPoint.row, startPoint.col).piece = new Rook(Color.WHITE, "./assets/White-Rook.png", "R")
					chkPromotion = true
				}
			}
			if (this._playerSide === Color.BLACK) {
				if (piecePromoted === "Queen") {
					this._board.getBox(startPoint.row, startPoint.col).piece = new Queen(Color.BLACK, "./assets/Black-Queen.png", "q")
					chkPromotion = true
				}
				if (piecePromoted === "Knight") {
					this._board.getBox(startPoint.row, startPoint.col).piece = new Knight(Color.BLACK, "./assets/Black-Knight.png", "n")
					chkPromotion = true
				}
				if (piecePromoted === "Bishop") {
					this._board.getBox(startPoint.row, startPoint.col).piece = new Bishop(Color.BLACK, "./assets/Black-Bishop.png", "b")
					chkPromotion = true
				}
				if (piecePromoted === "Rook") {
					this._board.getBox(startPoint.row, startPoint.col).piece = new Rook(Color.BLACK, "./assets/Black-Rook.png", "r")
					chkPromotion = true
				}
			}
		}
		//Hoán đổi nước đi
		let tmpPieceEnd
		tmpPieceEnd = endPoint.piece
		this._board.getBox(endPoint.row, endPoint.col).piece = this._board.getBox(startPoint.row, startPoint.col).piece
		this._board.getBox(startPoint.row, startPoint.col).piece = null
		if (this.isInCheck()) {
			//Undo
			this._board.getBox(startPoint.row, startPoint.col).piece = this._board.getBox(endPoint.row, endPoint.col).piece
			this._board.getBox(endPoint.row, endPoint.col).piece = tmpPieceEnd
			//Undo nếu đang chiếu mà phong cấp
			if(chkPromotion){
				if(this._playerSide === Color.BLACK){
					this._board.getBox(startPoint.row, startPoint.col).piece = new Pawn(Color.BLACK, "./assets/Black-Pawn.png", "p")
				}
				if(this._playerSide === Color.WHITE){
					this._board.getBox(startPoint.row, startPoint.col).piece = new Pawn(Color.WHITE, "./assets/White-Pawn.png", "P")
				}
				this._board.getBox(endPoint.row, endPoint.col).piece = tmpPieceEnd
				chkPromotion = false
			}

			if (this._board.catsling === Catsling.EXCUTE) {		//Kiểm tra vị trí nhập thành có bị chiếu?
				//Undo quân Rook
				this._board.getBox(startBoxRook!.row, startBoxRook!.col).piece = this._board.getBox(endBoxRook!.row, endBoxRook!.col).piece
				this._board.getBox(endBoxRook!.row, endBoxRook!.col).piece = tmpRookEnd!

				this._board.rookFarKing = true
				this._board.rookNearKing = true
				this._board.kingMoved = true
				this.board.catsling = Catsling.NOT
			}
			console.log("dang chieu")
			return false
		} else {
			if (this._board.catsling === Catsling.EXCUTE) this._board.catsling = Catsling.DONE
			return true;
		}

	}
	private isInCheck(): boolean {
		var opponentColor: Color
		if (this._playerSide === Color.WHITE) opponentColor = Color.BLACK
		else opponentColor = Color.WHITE

		let rowOfKing: number = this._board.getKingCoordinates(this._playerSide).row
		let colOfKing: number = this._board.getKingCoordinates(this._playerSide).col
		//Tốt chiếu
		if (rowOfKing - 1 >= 0 && colOfKing + 1 <= 7
			&& this._board.getBox(rowOfKing - 1, colOfKing + 1).piece?.color === opponentColor
			&& (this._board.getBox(rowOfKing - 1, colOfKing + 1).piece?.name === 'p'
				|| this._board.getBox(rowOfKing - 1, colOfKing + 1).piece?.name === 'P')) {
			console.log("tot chieu +1")
			return true
		}
		if (rowOfKing - 1 >= 0 && colOfKing - 1 >= 0
			&& this._board.getBox(rowOfKing - 1, colOfKing - 1).piece?.color === opponentColor
			&& (this._board.getBox(rowOfKing - 1, colOfKing - 1).piece?.name === 'p'
				|| this._board.getBox(rowOfKing - 1, colOfKing - 1).piece?.name === 'P')) {
			console.log("tot chieu -1")
			return true
		}
		//Mã chiếu
		const knightMoves = [
			{ row: -2, col: -1 },
			{ row: -2, col: 1 },
			{ row: -1, col: -2 },
			{ row: -1, col: 2 },
			{ row: 1, col: -2 },
			{ row: 1, col: 2 },
			{ row: 2, col: -1 },
			{ row: 2, col: 1 },
		];
		for (const knightMove of knightMoves) {
			const targetRow = rowOfKing + knightMove.row;
			const targetCol = colOfKing + knightMove.col;

			if (targetRow >= 0 && targetRow <= 7 && targetCol >= 0 && targetCol <= 7) {
				if (this._board.getBox(targetRow, targetCol).piece?.color === opponentColor
					&& (this._board.getBox(targetRow, targetCol).piece?.name === 'n'
						|| this._board.getBox(targetRow, targetCol).piece?.name === 'N')) {
					console.log("ma chieu" + knightMove.row + knightMove.col)
					return true
				}
			}
		}
		//Quét ngang dọc
		const directions = [
			{ row: 0, col: -1 },  // Left
			{ row: 0, col: 1 },   // Right
			{ row: -1, col: 0 },  // Up
			{ row: 1, col: 0 },    // Down
		];
		for (const direction of directions) {
			let r = rowOfKing + direction.row;
			let c = colOfKing + direction.col;

			while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
				if (this._board.getBox(r, c).piece?.color === this._playerSide) {
					break;	//Có quân cùng màu chắn
				}
				else {										//Quân khác màu chắn
					if (this._board.getBox(r, c).piece?.name === 'r'
						|| this._board.getBox(r, c).piece?.name === 'R'
						|| this._board.getBox(r, c).piece?.name === 'q'
						|| this._board.getBox(r, c).piece?.name === 'Q') {
						console.log("chiếu theo dọc hoặc ngang" + direction.row + direction.col)
						console.log("quân chiếu" + this._board.getBox(r, c).piece?.name + r + c)
						console.log("quân vua" + rowOfKing + colOfKing)
						return true;
					} else if (this._board.getBox(r, c).piece !== null) {
						break
					}
				}
				r += direction.row;
				c += direction.col;
			}
		}
		//Quét đường chéo
		const digDirections = [
			{ row: -1, col: -1 },  // Diagonal Up Left
			{ row: -1, col: 1 },   // Diagonal Up Right
			{ row: 1, col: -1 },   // Diagonal Down Left
			{ row: 1, col: 1 },    // Diagonal Down Right
		];
		for (const digDirection of digDirections) {
			let diagRow = rowOfKing + digDirection.row;
			let diagCol = colOfKing + digDirection.col;
			while (diagRow >= 0 && diagRow <= 7 && diagCol >= 0 && diagCol <= 7) {
				if (this._board.getBox(diagRow, diagCol).piece?.color === this._playerSide) break
				else {
					if (this._board.getBox(diagRow, diagCol).piece?.name === 'b'
						|| this._board.getBox(diagRow, diagCol).piece?.name === 'B'
						|| this._board.getBox(diagRow, diagCol).piece?.name === 'q'
						|| this._board.getBox(diagRow, diagCol).piece?.name === 'Q') {
						console.log("chiếu theo đường chéo" + digDirection.row + digDirection.col)
						return true
					} else if (this._board.getBox(diagRow, diagCol).piece !== null) {
						break
					}
				}

				diagRow = diagRow + digDirection.row
				diagCol = diagCol + digDirection.col;
			}
		}
		return false
	}
	private isAllValidMove(): boolean {
		let CASTLING: Catsling = this._board.catsling
		let FARROOK: boolean = this._board.rookFarKing
		let NEARROOK: boolean = this._board.rookNearKing
		let KINGMOVE: boolean = this._board.kingMoved
		let BOARD: string = this.getFullCoordinates()
		const directions = [
			{ row: -1, col: -2 }, { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 }, { row: -1, col: 2 },
			{ row: -2, col: -2 }, { row: -2, col: -1 }, { row: -2, col: 0 }, { row: -2, col: 1 }, { row: -2, col: 2 },
			{ row: 1, col: -2 }, { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 },
			{ row: 2, col: -2 }, { row: 2, col: -1 }, { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
			{ row: 0, col: -2 }, { row: 0, col: -1 }, { row: 0, col: 1 }, { row: 0, col: 2 },
		];
		// Lặp qua tất cả các ô trên bàn cờ
		for (let r = 0; r < 8; r++) {
			for (let c = 0; c < 8; c++) {
				if (this._board.getBox(r, c).piece !== null && this._board.getBox(r, c).piece?.color === this._playerSide) {
					let startPoint: Point = this._board.getBox(r, c)
					for (let direction of directions) {
						let rowEnd = r + direction.row
						let colEnd = c + direction.col
						if (rowEnd >= 0 && rowEnd <= 7 && colEnd >= 0 && colEnd <= 7) {
							let endPoint: Point = this._board.getBox(rowEnd, colEnd)
							if (this.makeMove(startPoint, endPoint)) {
								this._board.catsling = CASTLING
								this._board.rookFarKing = FARROOK
								this._board.rookNearKing = NEARROOK
								this._board.kingMoved = KINGMOVE
								console.log("isAllValidMove" + this._board.getBox(startPoint.row, startPoint.col).piece?.name + startPoint.row + startPoint.col + endPoint.row + endPoint.col)
								this.setFullCoordinates(BOARD)
								return true
							}
							this._board.catsling = CASTLING
							this._board.rookFarKing = FARROOK
							this._board.rookNearKing = NEARROOK
							this._board.kingMoved = KINGMOVE
							this.setFullCoordinates(BOARD)
						}
					}
				}
			}
		}
		return false
	}
	public checkGameStatus() {
		let a = this.isInCheck()
		let b = this.isAllValidMove()
		if (a && !b) {
			let iDUserSend: string | null = localStorage.getItem('iDUserSend');
            let iDUserReceive: string | null = localStorage.getItem('iDUserReceive');
            let iDRoom: string | null = localStorage.getItem('iDRoom');
            let idRoomUser: string | null = localStorage.getItem('idRoomUser');
            let userSendTempPort: string | null = localStorage.getItem('userSendTempPort');
            let userReceiveTempPort: string | null = localStorage.getItem('userReceiveTempPort');
            let result: GameStatus | null = GameStatus.LOSE
            let endGame: EndGame = new EndGame(
                iDUserSend ?? '', // Sử dụng ?? để kiểm tra null hoặc undefined và gán giá trị mặc định nếu không tồn tại
                iDUserReceive ?? '',
                iDRoom ?? '',
                idRoomUser ?? '',
                userSendTempPort ?? '',
                userReceiveTempPort ?? '',
				result ?? ''
            );
			sendEndGame(endGame);
			console.log("bạn đã thua")
			//SendThua
		}
		else if (!a && !b) {
			let iDUserSend: string | null = localStorage.getItem('iDUserSend');
            let iDUserReceive: string | null = localStorage.getItem('iDUserReceive');
            let iDRoom: string | null = localStorage.getItem('iDRoom');
            let idRoomUser: string | null = localStorage.getItem('idRoomUser');
            let userSendTempPort: string | null = localStorage.getItem('userSendTempPort');
            let userReceiveTempPort: string | null = localStorage.getItem('userReceiveTempPort');
            let result: GameStatus | null = GameStatus.DRAW
            let endGame: EndGame = new EndGame(
                iDUserSend ?? '', // Sử dụng ?? để kiểm tra null hoặc undefined và gán giá trị mặc định nếu không tồn tại
                iDUserReceive ?? '',
                iDRoom ?? '',
                idRoomUser ?? '',
                userSendTempPort ?? '',
                userReceiveTempPort ?? '',
				result ?? ''
            );
			sendEndGame(endGame);
			console.log("bạn hòa")
			// gameStatusAlert("Hòa cờ")
			// this._status = GameStatus.DRAW
			//SendHoa
		}
	}
	constructor(playerSide: Color, board: Board, currentTurn: boolean, status: GameStatus) {
        this._playerSide = playerSide;
        this._board = board;
        this._currentTurn = currentTurn;
        this._status = status;
    }
	static fromJSON(json: any): Game {
        const playerSide = json._playerSide;
        const board = json._board; // Chưa biết cấu trúc của Board là gì, cần cập nhật
        const currentTurn = json._currentTurn;
        const status = json._status;
        return new Game(playerSide, board, currentTurn, status);
    }
}