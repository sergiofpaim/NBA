export class GamePlay {
    quarter: number;
    type: string;
    points?: number | null;
    at: string;

    constructor(quarter: number, type: string, points: number | null | undefined, at: string) {
        this.quarter = quarter;
        this.type = type;
        this.points = points ?? null;
        this.at = at;
    }
}
