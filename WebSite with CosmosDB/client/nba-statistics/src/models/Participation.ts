import { GamePlay } from './GamePlay';

export class Participation {
    gameId: string;
    playerId: string;
    plays: GamePlay[];

    constructor(
        gameId: string,
        playerId: string,
        plays: GamePlay[]
    ) {
        this.gameId = gameId;
        this.playerId = playerId;
        this.plays = plays;
    }
}
