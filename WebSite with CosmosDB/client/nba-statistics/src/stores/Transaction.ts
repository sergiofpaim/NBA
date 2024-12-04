import { createSlice, PayloadAction, ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from './Root';
import { Game } from '../models/Game';
import { TeamScalation } from '../models/TeamScalation';
import { api } from '../utils/Api';
import { ParticipatingPlayer } from '../models/ParticipatingPlayer';

interface GamesOfCurrentSeasonState {
    games: Game[];
    currentGame: Game | null;
    error: string | null;
}

interface TeamsOfCurrentSeasonState {
    teams: TeamScalation[];
    error: string | null;
}

interface ParticipatingPlayersOfGameState {
    participations: ParticipatingPlayer[];
    currentParticipation: ParticipatingPlayer | null;
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

const initialParticipationsState: ParticipatingPlayersOfGameState = {
    participations: [],
    currentParticipation: null,
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
    initialState: initialParticipationsState,
    reducers: {
        fetchParticipationsRequest(state) {
            state.error = null;
        },
        fetchParticipationsSuccess(state, action: PayloadAction<ParticipatingPlayer[]>) {
            state.participations = action.payload;
        },
        fetchParticipationsFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        setCurrentParticipation(state, action: PayloadAction<any>) {
            state.currentParticipation = action.payload;
        }
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
    fetchParticipationsRequest,
    fetchParticipationsSuccess,
    fetchParticipationsFailure,
    setCurrentParticipation
} = playersSlice.actions;

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

export const fetchParticipations = (payload: { gameId: string }): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(fetchParticipationsRequest());

        const response = await api.get<ParticipatingPlayer[]>(`/transaction/games/${payload.gameId}/players`);
        if (response.success)
            dispatch(fetchParticipationsSuccess(response.payLoad));
        else
            dispatch(fetchParticipationsFailure(response.message));
    };
};

export const gameTransactionReducer = gamesSlice.reducer;
export const teamTransactionReducer = teamSlice.reducer;
export const playerTransactionReducer = playersSlice.reducer;