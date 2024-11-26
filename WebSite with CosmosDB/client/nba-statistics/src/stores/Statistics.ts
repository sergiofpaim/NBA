import { createSlice, PayloadAction, ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from './Root';
import { api } from '../utils/Api';
import { PlayerStatisticsInSeason } from '../models/Statistics/PlayerStatisticsInSeason';

interface SeasonStatisticsState {
    seasonStats: PlayerStatisticsInSeason | null;
    loading: boolean;
    error: string | null;
}

const initialSeasonsStatisticsState: SeasonStatisticsState = {
    seasonStats: null,
    loading: false,
    error: null,
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
        },
        fetchSeasonStatisticsFailure(state, action: PayloadAction<string>) {
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


export const seasonStatisticsReducer = seasonStatisticsSlice.reducer;