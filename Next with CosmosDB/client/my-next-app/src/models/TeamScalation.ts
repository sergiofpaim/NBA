import { PlayerSelection } from "./PlayerSelection";

export class TeamScalation {
    teamId: string;
    teamName: string;
    players: PlayerSelection[]

    constructor(teamId: string, teamName: string, players: PlayerSelection[]) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.players = players;
    }
}