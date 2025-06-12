export class Game {
    id: string;
    homeTeamId: string;
    homeTeamName: string;
    visitorTeamId: string;
    visitorTeamName: string;
    at: Date;

    constructor(id: string, homeTeamId: string, homeTeamName: string, visitorTeamId: string, visitorTeamName: string, at: Date) {
        this.id = id;
        this.homeTeamId = homeTeamId;
        this.homeTeamName = homeTeamName;
        this.visitorTeamId = visitorTeamId;
        this.visitorTeamName = visitorTeamName;
        this.at = at;
    }
}