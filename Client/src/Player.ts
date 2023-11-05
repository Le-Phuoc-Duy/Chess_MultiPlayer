import { Side } from "./Enum";
import { Color } from "./Enum";
export abstract class Player {
    // whiteSide: boolean;
    // humanPlayer: boolean;
    color: Color
    side: Side

    constructor(color: Color,side: Side) {
        this.side = side;
        this.color = color;
    }

    // isWhiteSide(): boolean {
    //     return this.whiteSide;
    // }

    // isHumanPlayer(): boolean {
    //     return this.humanPlayer;
    // }
}

export class Self extends Player {
    constructor(color: Color) {
        super(color, Side.SELF);
    }
}

export class Opponent extends Player {
    constructor(color: Color) {
        super(color, Side.OPPONENT);
    }
}
