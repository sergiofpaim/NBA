import { GamePlay } from './GamePlay';

export class Participation {
    seasonId: string;
    gameId: string;
    teamId: string;
    teamName: string;
    playerId: string;
    playerName: string;
    plays: GamePlay[];

    constructor(
        seasonId: string,
        gameId: string,
        teamId: string,
        teamName: string,
        playerId: string,
        playerName: string,
        plays: GamePlay[]
    ) {
        this.seasonId = seasonId;
        this.gameId = gameId;
        this.teamId = teamId;
        this.teamName = teamName;
        this.playerId = playerId;
        this.playerName = playerName;
        this.plays = plays;
    }
}
