export class PlayerStatisticsInGame {
    type: string;
    count: number;
    points: number;

    constructor(Type: string, Count: number, Points: number) {
        this.type = Type;
        this.count = Count;
        this.points = Points;
    }
}