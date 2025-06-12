import { createSlice, PayloadAction, ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from './Root';
import { Season } from '../models/Season';
import { Game } from '../models/Game';
import { ParticipatingPlayer } from '../models/ParticipatingPlayer';
import { api } from '../utils/Api';

interface SeasonsState {
  seasons: Season[];
  error: string | null;
}

interface GamesState {
  games: Game[];
  error: string | null;
}

interface PlayersState {
  players: ParticipatingPlayer[];
  error: string | null;
}

const initialSeasonsState: SeasonsState = {
  seasons: [],
  error: null,
};

const initialGamesState: GamesState = {
  games: [],
  error: null,
};

const initialPlayersState: PlayersState = {
  players: [],
  error: null,
};

const seasonsSlice = createSlice({
  name: 'seasons',
  initialState: initialSeasonsState,
  reducers: {
    fetchSeasonsRequest(state) {
      state.error = null;
    },
    fetchSeasonsSuccess(state, action: PayloadAction<Season[]>) {
      state.seasons = action.payload;
    },
    fetchSeasonsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

const gamesSlice = createSlice({
  name: 'selectionGames',
  initialState: initialGamesState,
  reducers: {
    fetchSelectionGamesRequest(state) {
      state.error = null;
    },
    fetchSelectionGamesSuccess(state, action: PayloadAction<Game[]>) {
      state.games = action.payload;
    },
    fetchSelectionGamesFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    resetSelectionGames(state) {
      state.games = [];
    },
  },
});

const playersSlice = createSlice({
  name: 'players',
  initialState: initialPlayersState,
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
    resetPlayers(state) {
      state.players = [];
    },
  },
});

export const {
  fetchSeasonsRequest,
  fetchSeasonsSuccess,
  fetchSeasonsFailure,
} = seasonsSlice.actions;

export const {
  fetchSelectionGamesRequest,
  fetchSelectionGamesSuccess,
  fetchSelectionGamesFailure,
  resetSelectionGames,
} = gamesSlice.actions;

export const {
  fetchPlayersRequest,
  fetchPlayersSuccess,
  fetchPlayersFailure,
  resetPlayers,
} = playersSlice.actions;

export const fetchSeasons = (): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch) => {
    dispatch(fetchSeasonsRequest());

    const response = await api.get<Season[]>('/transaction/seasons');
    if (response.success) {
      dispatch(fetchSeasonsSuccess(response.payLoad));
      dispatch(resetSelectionGames());
      dispatch(resetPlayers());
    }
    else
      dispatch(fetchSeasonsFailure(response.message));
  };
};

export const fetchSelectionGames = (payload: { seasonId: string }): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch) => {
    dispatch(fetchSelectionGamesRequest());

    const response = await api.get<Game[]>(`/transaction/seasons/${payload.seasonId}/games`);
    if (response.success) {
      dispatch(fetchSelectionGamesSuccess(response.payLoad));
      dispatch(resetPlayers());
    }
    else
      dispatch(fetchSelectionGamesFailure(response.message));
  };
};

export const fetchPlayers = (payload: { gameId: string }): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch) => {
    dispatch(fetchPlayersRequest());

    const response = await api.get<ParticipatingPlayer[]>(`/transaction/games/${payload.gameId}/players`);
    if (response.success)
      dispatch(fetchPlayersSuccess(response.payLoad));
    else
      dispatch(fetchPlayersFailure(response.message));
  };
};

export const seasonsReducer = seasonsSlice.reducer;
export const gamesReducer = gamesSlice.reducer;
export const playersReducer = playersSlice.reducer;