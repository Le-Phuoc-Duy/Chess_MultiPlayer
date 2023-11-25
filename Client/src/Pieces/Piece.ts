import { Board } from "../Board";
import { Point } from "../Point";
import { Color } from "../Enum";
export abstract class Piece { 
    private _killed : boolean = false
    private _color: Color 
    private _name: string = "/";
    private _image: string = ""

	constructor (color: Color, image: string, name: string) 
	{ 
		this._color = color
        this._image = image
        this._name = name
	} 
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get color(): Color {
        return this._color
    }
    public set color(value: Color) {
        this._color = value
    }
    public get killed(): boolean { 
		return this._killed
	}  
    public set killed(killed: boolean){
        this._killed = killed
    } 
    public get image(): string {
        return this._image
    }
    public set image(value: string) {
        this._image = value
    }
    abstract canMove(board: Board, startPoint: Point, endPoint: Point): boolean 
    abstract isPathClear(board: Board, startPoint: Point, endPoint: Point): boolean 
} 
