import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { Season } from '~/models/Season';
import { Game } from '~/models/Game';
import { ParticipatingPlayer } from '~/models/ParticipatingPlayer';

export const useSeasonsStore = defineStore('seasons', {
    state: () => ({
        seasons: [] as Season[],
        error: null as string | null,
    }),
    actions: {
        async fetchSeasons() {
            const { $api } = useNuxtApp();
            this.error = null;
            try {
                const response = await $api.get<Season[]>('/transaction/seasons');
                if (response.success) {
                    this.seasons = response.payLoad;
                    useGamesStore().resetSelectionGames();
                    usePlayersStore().resetPlayers();
                } else {
                    this.error = response.message;
                }
            } catch (err) {
                this.error = 'Failed to fetch seasons';
            }
        },
    },
});

export const useGamesStore = defineStore('selectionGames', {
    state: () => ({
        games: [] as Game[],
        error: null as string | null,
    }),
    actions: {
        async fetchSelectionGames(seasonId: string) {
            const { $api } = useNuxtApp();
            this.error = null;
            try {
                const response = await $api.get<Game[]>(`/transaction/seasons/${seasonId}/games`);
                if (response.success) {
                    this.games = response.payLoad;
                    usePlayersStore().resetPlayers();
                } else {
                    this.error = response.message;
                }
            } catch (err) {
                this.error = 'Failed to fetch selection games';
            }
        },
        resetSelectionGames() {
            this.games = [];
        },
    },
});

export const usePlayersStore = defineStore('players', {
    state: () => ({
        players: [] as ParticipatingPlayer[],
        error: null as string | null,
    }),
    actions: {
        async fetchPlayers(gameId: string) {
            const { $api } = useNuxtApp();
            this.error = null;
            try {
                const response = await $api.get<ParticipatingPlayer[]>(`/transaction/games/${gameId}/players`);
                if (response.success) {
                    this.players = response.payLoad;
                } else {
                    this.error = response.message;
                }
            } catch (err) {
                this.error = 'Failed to fetch players';
            }
        },
        resetPlayers() {
            this.players = [];
        },
    },
});