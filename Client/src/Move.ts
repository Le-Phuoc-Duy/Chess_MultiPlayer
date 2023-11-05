import { Player } from "./Player";
import { Point } from "./Point"; 
import { Piece } from "./Pieces/Piece";

export class Move{
    private _player: Player
    private _startPoint: Point 
    private _endPoint: Point
    private _pieceMoved: Piece | null
    private _pieceKilled: Piece

    constructor(player: Player, startPoint: Point, endPoint: Point){
        this._player = player
        this._startPoint = startPoint
        this._endPoint = endPoint 
        this._pieceMoved = startPoint.piece
    }
    public get startPoint(): Point {
        return this._startPoint;
    }
    public set startPoint(value: Point) {
        this._startPoint = value;
    }
    public get endPoint(): Point {
        return this._endPoint;
    }
    public set endPoint(value: Point) {
        this._endPoint = value;
    }
    public get pieceKilled(): Piece {
        return this._pieceKilled;
    }
    public set pieceKilled(value: Piece) {
        this._pieceKilled = value;
    }
}