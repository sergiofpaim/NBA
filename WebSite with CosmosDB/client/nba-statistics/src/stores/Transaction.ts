import { createSlice, PayloadAction, ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from './Root';
import { Game } from '../models/Game';
import { TeamScalation } from '../models/TeamScalation';
import { api } from '../utils/Api';
import { ParticipatingPlayer } from '../models/ParticipatingPlayer';
import { Participation } from '../models/Participation';

interface GamesOfCurrentSeasonState {
    games: Game[];
    currentGame: Game | null;
    error: string | null;
}

interface TeamsOfCurrentSeasonState {
    teams: TeamScalation[];
    error: string | null;
}

interface PlayersOfGameState {
    players: ParticipatingPlayer[];
    currentPlayer: ParticipatingPlayer | null;
    error: string | null;
}

interface ParticipationOfGameState {
    participation: Participation | null;
    error: string | null;
}

const initialGamesState: GamesOfCurrentSeasonState = {
    games: [],
    currentGame: null,
    error: null,
};

const initialTeamsState: TeamsOfCurrentSeasonState = {
    teams: [],
    error: null,
};

const initialPlayersOfGameState: PlayersOfGameState = {
    players: [],
    currentPlayer: null,
    error: null,
};

const initialParticipationOfGameState: ParticipationOfGameState = {
    participation: null,
    error: null,
};

const gamesSlice = createSlice({
    name: 'games',
    initialState: initialGamesState,
    reducers: {
        fetchGamesRequest(state) {
            state.error = null;
        },
        fetchGamesSuccess(state, action: PayloadAction<Game[]>) {
            state.games = action.payload;
        },
        fetchGamesFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        addGameRequest(state) {
            state.error = null;
        },
        addGameSuccess(state, action: PayloadAction<Game>) {
            state.games.unshift(action.payload);
        },
        addGameFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        setCurrentGame(state, action: PayloadAction<any>) {
            state.currentGame = action.payload;
        }
    }
});

const teamSlice = createSlice({
    name: 'teams',
    initialState: initialTeamsState,
    reducers: {
        fetchTeamsRequest(state) {
            state.error = null;
        },
        fetchTeamsSuccess(state, action: PayloadAction<TeamScalation[]>) {
            state.teams = action.payload;
        },
        fetchTeamsFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
    }
});

const playersSlice = createSlice({
    name: 'players',
    initialState: initialPlayersOfGameState,
    reducers: {
        fetchPlayersRequest(state) {
            state.error = null;
        },
        fetchPlayersSuccess(state, action: PayloadAction<ParticipatingPlayer[]>) {
            state.players = action.payload;
        },
        fetchPlayersFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        setCurrentPlayerOfGame(state, action: PayloadAction<any>) {
            state.currentPlayer = action.payload;
        }
    }
});

const participationSlice = createSlice({
    name: 'participation',
    initialState: initialParticipationOfGameState,
    reducers: {
        fetchParticipationRequest(state) {
            state.error = null;
        },
        fetchParticipationSuccess(state, action: PayloadAction<Participation>) {
            state.participation = action.payload;
        },
        fetchParticipationFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        addPlayRequest(state) {
            state.error = null;
        },
        addPlaySuccess(state, action: PayloadAction<Participation>) {
            state.participation = action.payload;
        },
        addPlayFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
    }
});

export const {
    fetchGamesRequest,
    fetchGamesSuccess,
    fetchGamesFailure,
    addGameRequest,
    addGameSuccess,
    addGameFailure,
    setCurrentGame
} = gamesSlice.actions;

export const {
    fetchTeamsRequest,
    fetchTeamsSuccess,
    fetchTeamsFailure
} = teamSlice.actions;

export const {
    fetchPlayersRequest,
    fetchPlayersSuccess,
    fetchPlayersFailure,
    setCurrentPlayerOfGame
} = playersSlice.actions;

export const {
    fetchParticipationRequest,
    fetchParticipationSuccess,
    fetchParticipationFailure,
    addPlayRequest,
    addPlaySuccess,
    addPlayFailure
} = participationSlice.actions;

export const fetchGames = (): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(fetchGamesRequest());

        const response = await api.get<Game[]>(`/transaction/seasons/last/games`);
        if (response.success)
            dispatch(fetchGamesSuccess(response.payLoad));
        else
            dispatch(fetchGamesFailure(response.message));
    };
};

export const createGame = (payload: { homeTeamId: string; visitorTeamId: string; at: Date }): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(fetchGamesRequest());

        const response = await api.post(`/transaction/games`, payload);
        if (response.success)
            dispatch(addGameSuccess(response.payLoad as Game));
        else
            dispatch(addGameFailure(response.message));
    };
};

export const fetchTeams = (payload: { seasonId: string }): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(fetchTeamsRequest());

        const response = await api.get<TeamScalation[]>(`transaction/seasons/${payload.seasonId}/teams`);
        if (response.success)
            dispatch(fetchTeamsSuccess(response.payLoad));
        else
            dispatch(fetchTeamsFailure(response.message));
    };
};

export const fetchPlayers = (payload: { gameId: string }): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(fetchPlayersRequest());

        const response = await api.get<ParticipatingPlayer[]>(`/transaction/games/${payload.gameId}/players`);
        if (response.success)
            dispatch(fetchPlayersSuccess(response.payLoad));
        else
            dispatch(fetchPlayersFailure(response.message));
    };
};

export const fetchParticipation = (payload: { gameId: string; playerId: string }): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(fetchParticipationRequest());

        const response = await api.get<Participation>(`/transaction/games/${payload.gameId}/players/${payload.playerId}/participation`);
        if (response.success)
            dispatch(fetchParticipationSuccess(response.payLoad));
        else
            dispatch(fetchParticipationFailure(response.message));
    };
};

export const addPlay = (payload: { gameId: string; playerId: string; quarter: number; type: string }): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(addPlayRequest());

        const response = await api.post(`/transaction/plays`, payload);
        if (response.success)
            dispatch(addPlaySuccess(response.payLoad as Participation));
        else
            dispatch(addPlayFailure(response.message));
    };
};

export const gameTransactionReducer = gamesSlice.reducer;
export const teamTransactionReducer = teamSlice.reducer;
export const playerTransactionReducer = playersSlice.reducer;
export const participationTransactionReducer = participationSlice.reducer;