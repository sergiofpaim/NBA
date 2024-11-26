import { createSlice, PayloadAction, ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from './Root';
import { api } from '../utils/Api';
import { PlayerStatisticsInSeason } from '../models/Statistics/PlayerStatisticsInSeason';
import { PlayerStatisticsInGame } from '../models/Statistics/PlayerStatisticsInGame';

interface SeasonStatisticsState {
    seasonStats: PlayerStatisticsInSeason | null;
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
}

const initialSeasonsStatisticsState: SeasonStatisticsState = {
    seasonStats: null,
    loading: false,
    error: null,
    lastUpdated: null
};

interface GameStatisticsState {
    gameStats: PlayerStatisticsInGame[];
    loading: boolean;
    error: string | null;
}

const initialGameStatisticsState: GameStatisticsState = {
    gameStats: [],
    loading: false,
    error: null
};

const seasonStatisticsSlice = createSlice({
    name: 'seasonStatistics',
    initialState: initialSeasonsStatisticsState,
    reducers: {
        fetchSeasonStatisticsRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchSeasonStatisticsSuccess(state, action: PayloadAction<PlayerStatisticsInSeason>) {
            state.loading = false;
            state.seasonStats = action.payload;
            state.lastUpdated = new Date();
        },
        fetchSeasonStatisticsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

const gameStatisticsSlice = createSlice({
    name: 'gameStatistics',
    initialState: initialGameStatisticsState,
    reducers: {
        fetchGameStatisticsRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchGameStatisticsSuccess(state, action: PayloadAction<PlayerStatisticsInGame[]>) {
            state.loading = false;
            state.gameStats = action.payload;
        },
        fetchGameStatisticsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchSeasonStatisticsRequest,
    fetchSeasonStatisticsSuccess,
    fetchSeasonStatisticsFailure,
} = seasonStatisticsSlice.actions;

export const {
    fetchGameStatisticsRequest,
    fetchGameStatisticsSuccess,
    fetchGameStatisticsFailure,
} = gameStatisticsSlice.actions;

export const fetchSeasonStatistics = (seasonId: string, playerId: string): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(fetchSeasonStatisticsRequest());

        const response = await api.get<PlayerStatisticsInSeason>(`/statistics/seasons/${seasonId}/players/${playerId}`);
        if (response.success)
            dispatch(fetchSeasonStatisticsSuccess(response.payLoad));
        else
            dispatch(fetchSeasonStatisticsFailure(response.message));
    };
};

export const fetchGameStatistics = (gameId: string, playerId: string): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(fetchSeasonStatisticsRequest());

        const response = await api.get<PlayerStatisticsInGame[]>(`/statistics/games/${gameId}/players/${playerId}`);
        if (response.success)
            dispatch(fetchGameStatisticsSuccess(response.payLoad));
        else
            dispatch(fetchGameStatisticsFailure(response.message));
    };
};


export const seasonStatisticsReducer = seasonStatisticsSlice.reducer;
export const gameStatisticsReducer = gameStatisticsSlice.reducer;