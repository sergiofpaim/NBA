export interface AddPlayParm {
    playerId: string;
    gameId: string;
    quarter: number;
    playType: number;
}

export interface AddGameParm {
    homeTeamId: string;
    visitorTeamId: string;
    at: Date;
}

export interface ListPlayParms {
    playerId: string;
    gameId: string;
}

export interface Play {
    quarter: number;
    type: string;
    points: number;
    at: string;
}
