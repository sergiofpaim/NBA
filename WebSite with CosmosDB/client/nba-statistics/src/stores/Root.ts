import { combineReducers } from '@reduxjs/toolkit';
import { seasonsReducer, gamesReducer, playersReducer } from './Selection';
import { statisticsReducer } from './Statistics';

const rootReducer = combineReducers({
    seasons: seasonsReducer,
    games: gamesReducer,
    players: playersReducer,
    statistics: statisticsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;