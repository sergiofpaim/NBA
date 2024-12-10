import { GamePlay } from "./GamePlay";

export class ParticipatingPlayer {
    playerId: string;
    playerName: string;
    participationId: string;
    teamId: string;
    teamname: string;
    plays: GamePlay[];

    constructor(playerId: string, playerName: string, participationid: string, teamId: string, teamname: string, plays: GamePlay[]) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.participationId = participationid;
        this.teamId = teamId;
        this.teamname = teamname;
        this.plays = plays;
    }
}