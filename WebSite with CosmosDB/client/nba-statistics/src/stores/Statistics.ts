import { createSlice, PayloadAction, ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from './Root';
import { api } from '../utils/Api';
import { PlayerStatisticsInSeason } from '../models/Statistics/PlayerStatisticsInSeason';
import { PlayerStatisticsInGame } from '../models/Statistics/PlayerStatisticsInGame';

interface StatisticsState {
    ofSeason: PlayerStatisticsInSeason | null;
    ofGame: PlayerStatisticsInGame[] | null;
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
}

const initialState: StatisticsState = {
    ofSeason: null,
    ofGame: null,
    loading: false,
    error: null,
    lastUpdated: null,
};

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState: initialState,
    reducers: {
        fetchStatisticsRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchStatisticsSuccess(
            state,
            action: PayloadAction<{
                ofSeason: PlayerStatisticsInSeason;
                ofGame: PlayerStatisticsInGame[];
            }>
        ) {
            state.loading = false;
            state.ofSeason = action.payload.ofSeason;
            state.ofGame = action.payload.ofGame;
            state.lastUpdated = new Date();
        },
        fetchStatisticsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        resetStatistics(state) {
            state.loading = false;
            state.ofSeason = null;
            state.ofGame = null;
            state.lastUpdated = null;
        },
    },
});

export const {
    fetchStatisticsRequest,
    fetchStatisticsSuccess,
    fetchStatisticsFailure,
    resetStatistics
} = statisticsSlice.actions;


export const fetchStatistics = (seasonId: string, gameId: string, playerId: string): ThunkAction<void, RootState, unknown, Action<string>> => {
    return async (dispatch) => {
        dispatch(fetchStatisticsRequest());

        const [seasonResponse, gameResponse] = await Promise.all([
            api.get<PlayerStatisticsInSeason>(`/statistics/seasons/${seasonId}/players/${playerId}`),
            api.get<PlayerStatisticsInGame[]>(`/statistics/games/${gameId}/players/${playerId}`),
        ]);
        if (seasonResponse.success && gameResponse.success) {
            dispatch(
                fetchStatisticsSuccess({
                    ofSeason: seasonResponse.payLoad,
                    ofGame: gameResponse.payLoad,
                })
            );
        } else {
            const errorMessage =
                seasonResponse.message || gameResponse.message || 'Failed to fetch statistics';
            dispatch(fetchStatisticsFailure(errorMessage));
        }
    };
};

export const statisticsReducer = statisticsSlice.reducer;