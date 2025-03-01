import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import { PlayerStatisticsInGame } from "~/models/statistics/PlayerStatisticsInGame";
import type { PlayerStatisticsInSeason } from "~/models/statistics/PlayerStatisticsInSeason";

export const useStatisticsStore = defineStore("statistics", {
    state: () => ({
        ofSeason: null as PlayerStatisticsInSeason | null,
        ofGame: null as PlayerStatisticsInGame[] | null,
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchStatistics(payload: { seasonId: string; gameId: string; playerId: string }) {
            const { $api } = useNuxtApp();
            this.loading = true;
            this.error = null;

            try {
                const [seasonResponse, gameResponse] = await Promise.all([
                    $api.get<PlayerStatisticsInSeason>(`/statistics/seasons/${payload.seasonId}/players/${payload.playerId}`),
                    $api.get<PlayerStatisticsInGame[]>(`/statistics/games/${payload.gameId}/players/${payload.playerId}`),
                ]);

                if (seasonResponse && gameResponse) {
                    this.ofSeason = seasonResponse.payLoad;
                    this.ofGame = gameResponse.payLoad;
                } else {
                    this.error = "Failed to fetch statistics";
                    console.error(this.error);
                }
            } catch (error) {
                this.error = "API call failed";
                console.error(this.error, error);
            } finally {
                this.loading = false;
            }
        },
    },
    getters: {
        formattedSeasonStats: (state) => {
            return state.ofSeason
                ? JSON.stringify(state.ofSeason, null, 2)
                : "No season statistics available.";
        },
        formattedGameStats: (state) => {
            return state.ofGame && state.ofGame.length > 0
                ? JSON.stringify(state.ofGame, null, 2)
                : "No game statistics available.";
        },
    },
});