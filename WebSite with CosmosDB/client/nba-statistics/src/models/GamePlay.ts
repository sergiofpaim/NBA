export class GamePlay {
    quarter: number;
    type: string;
    points?: number | null;
    at: Date;

    constructor(quarter: number, type: string, points: number | null | undefined, at: Date) {
        this.quarter = quarter;
        this.type = type;
        this.points = points ?? null;
        this.at = at;
    }
}
