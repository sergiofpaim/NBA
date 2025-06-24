export class GamePlay {
    quarter: number;
    type: string;
    points?: number | null;
    at: Date;

    constructor(quarter: number, type: string, points: number | null | undefined, at: string) {
        this.quarter = quarter;
        this.type = type;
        this.points = points ?? null;
        this.at = this.convertToTimeOnly(at);
    }

    private convertToTimeOnly(timeStr: string): Date {
        const [hours, minutes, secondsWithMilliseconds] = timeStr.split(':');
        const [seconds] = secondsWithMilliseconds.split('.');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        date.setSeconds(parseInt(seconds, 10));
        date.setMilliseconds(0);
        return date;
    }
}
