import { createSlice, PayloadAction, ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from './Root';
import { Season } from '../models/Season';
import { Game } from '../models/Game';
import { Participation } from '../models/Participation';
import { api } from '../utils/Api';  // Directly import the singleton api instance

interface SeasonsState {
  seasons: Season[];
  loading: boolean;
  error: string | null;
}

interface GamesState {
  games: Game[];
  loading: boolean;
  error: string | null;
}

interface PlayersState {
  players: Participation[];
  loading: boolean;
  error: string | null;
}

const initialSeasonsState: SeasonsState = {
  seasons: [],
  loading: false,
  error: null,
};

const initialGamesState: GamesState = {
  games: [],
  loading: false,
  error: null,
};

const initialPlayersState: PlayersState = {
  players: [],
  loading: false,
  error: null,
};

const seasonsSlice = createSlice({
  name: 'seasons',
  initialState: initialSeasonsState,
  reducers: {
    fetchSeasonsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSeasonsSuccess(state, action: PayloadAction<Season[]>) {
      state.loading = false;
      state.seasons = action.payload;
    },
    fetchSeasonsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const gamesSlice = createSlice({
  name: 'games',
  initialState: initialGamesState,
  reducers: {
    fetchGamesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchGamesSuccess(state, action: PayloadAction<Game[]>) {
      state.loading = false;
      state.games = action.payload;
    },
    fetchGamesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetGames(state) {
      state.games = [];
    },
  },
});

const playersSlice = createSlice({
  name: 'players',
  initialState: initialPlayersState,
  reducers: {
    fetchPlayersRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPlayersSuccess(state, action: PayloadAction<Participation[]>) {
      state.loading = false;
      state.players = action.payload;
    },
    fetchPlayersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
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
  fetchGamesRequest,
  fetchGamesSuccess,
  fetchGamesFailure,
  resetGames,
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
      dispatch(resetGames());
      dispatch(resetPlayers());
    }
    else
      dispatch(fetchSeasonsFailure(response.message));
  };
};

export const fetchGames = (seasonId: string): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch) => {
    dispatch(fetchGamesRequest());

    const response = await api.get<Game[]>(`/transaction/seasons/${seasonId}/games`);
    if (response.success) {
      dispatch(fetchGamesSuccess(response.payLoad));
      dispatch(resetPlayers());
    }
    else
      dispatch(fetchGamesFailure(response.message));
  };
};

export const fetchPlayers = (gameId: string): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch) => {
    dispatch(fetchPlayersRequest());

    const response = await api.get<Participation[]>(`/transaction/games/${gameId}/players`);
    if (response.success)
      dispatch(fetchPlayersSuccess(response.payLoad));
    else
      dispatch(fetchPlayersFailure(response.message));
  };
};

export const seasonsReducer = seasonsSlice.reducer;
export const gamesReducer = gamesSlice.reducer;
export const playersReducer = playersSlice.reducer;