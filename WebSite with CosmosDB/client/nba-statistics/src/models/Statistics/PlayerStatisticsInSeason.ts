export class PlayerStatisticsInSeason {
    Participations: number;
    PPG: number;
    APG: number;
    RPG: number;
    BPG: number;
    TotalPoints: number;
    FTConversion: number;


    constructor(Participations: number, PPG: number, APG: number, RPG: number, BPG: number, TotalPoints: number, FTConversion: number) {
        this.Participations = Participations;
        this.PPG = PPG;
        this.APG = APG;
        this.RPG = RPG;
        this.BPG = BPG;
        this.TotalPoints = TotalPoints;
        this.FTConversion = FTConversion;
    }
}