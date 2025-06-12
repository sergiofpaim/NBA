export class PlayerStatisticsInSeason {
    participations: number;
    ppg: number;
    apg: number;
    rpg: number;
    bpg: number;
    totalPoints: number;
    ftConversion: number;

    constructor(Participations: number, PPG: number, APG: number, RPG: number, BPG: number, TotalPoints: number, FTConversion: number) {
        this.participations = Participations;
        this.ppg = PPG;
        this.apg = APG;
        this.rpg = RPG;
        this.bpg = BPG;
        this.totalPoints = TotalPoints;
        this.ftConversion = FTConversion;
    }
}