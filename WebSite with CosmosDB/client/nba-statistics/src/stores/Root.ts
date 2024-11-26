import { combineReducers } from '@reduxjs/toolkit';
import { seasonsReducer, gamesReducer, playersReducer } from './Selection';
import { seasonStatisticsReducer } from './Statistics';

const rootReducer = combineReducers({
    seasons: seasonsReducer,
    games: gamesReducer,
    players: playersReducer,
    seasonStats: seasonStatisticsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;