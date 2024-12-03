import { createSlice, PayloadAction, ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from './Root';
import { Game } from '../models/Game';
import { api } from '../utils/Api';

interface GamesState {
    games: Game[];
    currentGame: Game | null;
    error: string | null;
}

const initialGamesState: GamesState = {
    games: [],
    currentGame: null,
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
            state.games.push(action.payload);
        },
        addGameFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        setCurrentGame(state, action: PayloadAction<any>) {
            state.currentGame = action.payload;
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

export const createGame = (gameData: { homeTeamId: string; visitorTeamId: string; at: Date }): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(fetchGamesRequest());

        const response = await api.post(`/transaction/games`, gameData);
        if (response.success)
            dispatch(addGameSuccess(response.payLoad as Game));
        else
            dispatch(addGameFailure(response.message));
    };
};

export const gameTransactionReducer = gamesSlice.reducer;