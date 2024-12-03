import { combineReducers } from '@reduxjs/toolkit';
import { seasonsReducer, gamesReducer, playersReducer } from './Selection';
import { statisticsReducer } from './Statistics';
import { gameTransactionReducer } from './Transaction';

const rootReducer = combineReducers({
    seasons: seasonsReducer,
    games: gamesReducer,
    players: playersReducer,
    statistics: statisticsReducer,
    transactionGames: gameTransactionReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;