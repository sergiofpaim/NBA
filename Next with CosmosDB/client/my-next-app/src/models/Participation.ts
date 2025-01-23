import { GamePlay } from './GamePlay';

export class Participation {
    participationId: string;
    gameId: string;
    playerId: string;
    plays: GamePlay[];

    constructor(
        participationId: string,
        gameId: string,
        playerId: string,
        plays: GamePlay[]
    ) {
        this.participationId = participationId;
        this.gameId = gameId;
        this.playerId = playerId;
        this.plays = plays;
    }
}
