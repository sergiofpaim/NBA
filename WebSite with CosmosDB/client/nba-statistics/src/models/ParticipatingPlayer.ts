export class ParticipatingPlayer {
    playerId: string;
    playerName: string;
    participationId: string;
    teamId: string;
    teamname: string;

    constructor(playerId: string, playerName: string, participationid: string, teamId: string, teamname: string) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.participationId = participationid;
        this.teamId = teamId;
        this.teamname = teamname;
    }
}