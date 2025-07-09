import { defineStore } from 'pinia';
import { Game } from '@/models/Game';
import { TeamScalation } from '@/models/TeamScalation';
import { ParticipatingPlayer } from '@/models/ParticipatingPlayer';
import { Participation } from '@/models/Participation';
import type { PlayerSelection } from '~/models/PlayerSelection';

interface GamesOfCurrentSeasonState {
    games: Game[];
    currentGame: Game | null;
    error: string | null;
    loaded: boolean;
}

interface TeamsOfCurrentSeasonState {
    teams: TeamScalation[];
    error: string | null;
    loaded: boolean;
}

interface PlayersOfGameState {
    players: PlayerSelection[];
    currentPlayer: PlayerSelection | null;
    participations: ParticipatingPlayer[];
    currentParticipation: ParticipatingPlayer | null;
    error: string | null;
}

interface ParticipationOfGameState {
    participation: Participation | null;
    error: string | null;
}

export const useTransactionStore = defineStore('transaction', {
    state: () => ({
        gamesState: <GamesOfCurrentSeasonState>{
            games: [],
            currentGame: null,
            error: null,
            loaded: false,
        },
        teamsState: <TeamsOfCurrentSeasonState>{
            teams: [],
            error: null,
            loaded: false,
        },
        playersState: <PlayersOfGameState>{
            players: [],
            currentPlayer: null,
            participations: [],
            currentParticipation: null,
            error: null,
        },
        participationState: <ParticipationOfGameState>{
            participation: null,
            error: null,
        },
    }),

    actions: {
        async loadGames() {
            if (this.gamesState.loaded) return;
            this.gamesState.error = null;
            const { $api } = useNuxtApp();
            const response = await $api.get<Game[]>(`/transaction/seasons/last/games`);
            if (response.success) {
                this.gamesState.games = response.payLoad;
                this.gamesState.loaded = true;
            } else {
                this.gamesState.error = response.message;
            }
        },

        async createGame(payload: { homeTeamId: string; visitorTeamId: string; at: Date }) {
            this.gamesState.error = null;
            const { $api } = useNuxtApp();
            const response = await $api.post(`/transaction/games`, payload);
            if (response.success) {
                const game = response.payLoad as Game;
                this.gamesState.games.unshift(game);
                this.gamesState.currentGame = game;
            } else {
                this.gamesState.error = response.message;
            }
        },

        setCurrentGame(game: Game | null) {
            this.gamesState.currentGame = game;
        },

        async loadTeams() {
            if (this.teamsState.loaded) return;
            this.teamsState.error = null;
            const { $api } = useNuxtApp();
            const response = await $api.get<TeamScalation[]>(`transaction/seasons/last/teams`);
            if (response.success) {
                this.teamsState.teams = response.payLoad;
                this.teamsState.loaded = true;
            } else {
                this.teamsState.error = response.message;
            }
        },

        setCurrentPlayer(player: PlayerSelection | null) {
            this.playersState.currentPlayer = player;
        },

        async loadPlayers(payload: { gameId: string }) {
            this.playersState.error = null;
            const { $api } = useNuxtApp();
            const response = await $api.get<ParticipatingPlayer[]>(`/transaction/games/${payload.gameId}/players`);
            if (response.success) {
                this.playersState.players = response.payLoad;
            } else {
                this.playersState.error = response.message;
            }
        },

        async loadParticipations(payload: { gameId: string }) {
            this.playersState.error = null;
            const { $api } = useNuxtApp();
            const response = await $api.get<ParticipatingPlayer[]>(`/transaction/games/${payload.gameId}/participations`);
            if (response.success) {
                this.playersState.participations = response.payLoad;
            } else {
                this.playersState.error = response.message;
            }
        },

        setCurrentParticipation(player: ParticipatingPlayer | null) {
            this.playersState.currentParticipation = player;
        },

        async fetchParticipation(payload: { gameId: string; playerId: string }) {
            this.participationState.error = null;
            const { $api } = useNuxtApp();
            const response = await $api.get<Participation>(`/transaction/games/${payload.gameId}/players/${payload.playerId}/participation`);
            if (response.success) {
                this.participationState.participation = response.payLoad;
            } else {
                this.participationState.error = response.message;
            }
        },

        setParticipation(participation: Participation | null) {
            this.participationState.participation = participation;
        },

        async addPlay(payload: { gameId: string; playerId: string; quarter: number; type: string }) {
            this.participationState.error = null;
            const { $api } = useNuxtApp();
            const response = await $api.post(`/transaction/plays`, payload);
            if (response.success) {
                this.participationState.participation = response.payLoad as Participation;
            } else {
                this.participationState.error = response.message;
            }
        },

        async deletePlay(payload: { participationId: string; at: Date }) {
            this.participationState.error = null;
            const { $api } = useNuxtApp();
            const response = await $api.delete(`/transaction/plays/participation/${payload.participationId}/at/${payload.at}`);
            if (response.success) {
                this.participationState.participation = response.payLoad as Participation;
            } else {
                this.participationState.error = response.message;
            }
        }
    }
});
