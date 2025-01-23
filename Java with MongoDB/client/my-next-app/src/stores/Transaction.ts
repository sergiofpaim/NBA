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
    loaded: boolean;
}

interface TeamsOfCurrentSeasonState {
    teams: TeamScalation[];
    error: string | null;
    loaded: boolean;
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
    loaded: false
};

const initialTeamsState: TeamsOfCurrentSeasonState = {
    teams: [],
    error: null,
    loaded: false
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
            state.loaded = true;
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
        setCurrentGame(state, action: PayloadAction<Game | null>) {
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
            state.loaded = true;
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
        setParticipation(state, action: PayloadAction<any>) {
            state.participation = action.payload;
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
        deletePlayRequest(state) {
            state.error = null;
        },
        deletePlaySuccess(state, action: PayloadAction<Participation>) {
            state.participation = action.payload;
        },
        deletePlayFailure(state, action: PayloadAction<string>) {
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
    setParticipation,
    addPlayRequest,
    addPlaySuccess,
    addPlayFailure,
    deletePlayRequest,
    deletePlaySuccess,
    deletePlayFailure
} = participationSlice.actions;

export const loadGames = (): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch, getState) => {
        const state = getState();
        if (!state.transactionGames.loaded) {
            dispatch(fetchGamesRequest());

            const response = await api.get<Game[]>(`/transaction/seasons/last/games`);
            if (response.success) {
                dispatch(fetchGamesSuccess(response.payLoad));
            } else {
                dispatch(fetchGamesFailure(response.message));
            }
        }
    };
};

export const createGame = (payload: { homeTeamId: string; visitorTeamId: string; at: Date }): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(fetchGamesRequest());

        const response = await api.post(`/transaction/games`, payload);
        if (response.success) {
            dispatch(addGameSuccess(response.payLoad as Game));
            dispatch(setCurrentGame(response.payLoad as Game));
        }
        else
            dispatch(addGameFailure(response.message));
    };
};

export const loadTeams = (): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch, getState) => {
        const state = getState();
        if (!state.transactionTeams.loaded) {
            dispatch(fetchTeamsRequest());

            const response = await api.get<TeamScalation[]>(`transaction/seasons/last/teams`);
            if (response.success) {
                dispatch(fetchTeamsSuccess(response.payLoad));
            } else {
                dispatch(fetchTeamsFailure(response.message));
            }
        }
    };
};

export const loadPlayers = (payload: { gameId: string }): ThunkAction<void, RootState, unknown, Action<string>> => {
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

export const deletePlay = (payload: { participationId: string; at: Date }): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(deletePlayRequest());
        const response = await api.delete(`/transaction/plays/participation/${payload.participationId}/at/${payload.at}`);
        if (response.success)
            dispatch(deletePlaySuccess(response.payLoad as Participation));
        else
            dispatch(deletePlayFailure(response.message));
    };
};

export const gameTransactionReducer = gamesSlice.reducer;
export const teamTransactionReducer = teamSlice.reducer;
export const playerTransactionReducer = playersSlice.reducer;
export const participationTransactionReducer = participationSlice.reducer;