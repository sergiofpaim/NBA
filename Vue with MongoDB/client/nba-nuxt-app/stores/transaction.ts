import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import { TeamScalation } from "~/models/TeamScalation";
import { ParticipatingPlayer } from "~/models/ParticipatingPlayer";
import { Participation } from "~/models/Participation";
import type { Game } from "~/models/Game";

export const useGamesStore = defineStore("games", {
    state: () => ({
        games: [] as Game[],
        currentGame: null as Game | null,
        error: null as string | null,
        loaded: false,
    }),

    actions: {
        async loadGames() {
            if (this.loaded) return;
            this.error = null;
            const { $api } = useNuxtApp();
            try {
                const response = await $api.get<Game[]>("/transaction/seasons/last/games");
                if (response.success) {
                    this.games = response.payLoad;
                    this.loaded = true;
                } else {
                    this.error = response.message;
                }
            } catch (err) {
                this.error = "Failed to fetch games";
            }
        },

        async createGame(payload: { homeTeamId: string; visitorTeamId: string; at: Date }) {
            this.error = null;
            const { $api } = useNuxtApp();
            try {
                const response = await $api.post("/transaction/games", payload);
                if (response.success) {
                    this.games.unshift(response.payLoad as Game);
                    this.currentGame = response.payLoad as Game;
                } else {
                    this.error = response.message;
                }
            } catch (err) {
                this.error = "Failed to create game";
            }
        },

        setCurrentGame(game: Game | null) {
            this.currentGame = game;
        }
    }
});

export const useTeamsStore = defineStore("teams", {
    state: () => ({
        teams: [] as TeamScalation[],
        error: null as string | null,
        loaded: false,
    }),

    actions: {
        async loadTeams() {
            if (this.loaded) return;
            this.error = null;
            const { $api } = useNuxtApp();
            try {
                const response = await $api.get<TeamScalation[]>("/transaction/seasons/last/teams");
                if (response.success) {
                    this.teams = response.payLoad;
                    this.loaded = true;
                } else {
                    this.error = response.message;
                }
            } catch (err) {
                this.error = "Failed to fetch teams";
            }
        }
    }
});

export const usePlayersStore = defineStore("players", {
    state: () => ({
        players: [] as ParticipatingPlayer[],
        currentPlayer: null as ParticipatingPlayer | null,
        error: null as string | null,
    }),

    actions: {
        async loadPlayers(gameId: string) {
            this.error = null;
            const { $api } = useNuxtApp();
            try {
                const response = await $api.get<ParticipatingPlayer[]>(`/transaction/games/${gameId}/players`);
                if (response.success) {
                    this.players = response.payLoad;
                } else {
                    this.error = response.message;
                }
            } catch (err) {
                this.error = "Failed to fetch players";
            }
        },

        setCurrentPlayer(player: ParticipatingPlayer) {
            this.currentPlayer = player;
        }
    }
});

export const useParticipationStore = defineStore("participation", {
    state: () => ({
        participation: null as Participation | null,
        error: null as string | null,
    }),

    actions: {
        async loadParticipation(gameId: string, playerId: string) {
            this.error = null;
            const { $api } = useNuxtApp();
            try {
                const response = await $api.get<Participation>(`/transaction/games/${gameId}/players/${playerId}/participation`);
                if (response.success) {
                    this.participation = response.payLoad;
                } else {
                    this.error = response.message;
                }
            } catch (err) {
                this.error = "Failed to fetch participation";
            }
        },

        async addPlay(payload: { gameId: string; playerId: string; quarter: number; type: string }) {
            this.error = null;
            const { $api } = useNuxtApp();
            try {
                const response = await $api.post("/transaction/plays", payload);
                if (response.success) {
                    this.participation = response.payLoad as Participation;
                } else {
                    this.error = response.message;
                }
            } catch (err) {
                this.error = "Failed to add play";
            }
        },

        async deletePlay(payload: { participationId: string; at: Date }) {
            this.error = null;
            const { $api } = useNuxtApp();
            try {
                const response = await $api.del(`/transaction/plays/participation/${payload.participationId}/at/${payload.at}`);
                if (response.success) {
                    this.participation = response.payLoad as Participation;
                } else {
                    this.error = response.message;
                }
            } catch (err) {
                this.error = "Failed to delete play";
            }
        }
    }
});