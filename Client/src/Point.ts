import { Piece } from "./Pieces/Piece";

export class Point { 
	private _piece: Piece | null;
    private _col: number;
    private _row: number;

    constructor(row: number, col: number, piece?: Piece) { 
        this._piece = piece || null;
        this._row = row;
        this._col = col;
    }

	public get piece(): Piece | null{
		return this._piece;
	}
	set piece(value: Piece | null) {
		this._piece = value;
	}
	
	public get col(): number {
		return this._col;
	}
	public set col(value: number) {
		this._col = value;
	}
	 
	public get row(): number {
		return this._row;
	}
	public set row(value: number) {
		this._row = value;
	} 
} 
