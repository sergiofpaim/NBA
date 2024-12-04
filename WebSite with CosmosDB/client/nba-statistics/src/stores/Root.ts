import { combineReducers } from '@reduxjs/toolkit';
import { seasonsReducer, gamesReducer, playersReducer } from './Selection';
import { statisticsReducer } from './Statistics';
import { gameTransactionReducer, playerTransactionReducer, teamTransactionReducer } from './Transaction';

const rootReducer = combineReducers({
    seasons: seasonsReducer,
    games: gamesReducer,
    players: playersReducer,
    statistics: statisticsReducer,
    transactionGames: gameTransactionReducer,
    transactionTeams: teamTransactionReducer,
    transactionPlayers: playerTransactionReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;