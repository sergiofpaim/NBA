import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import { PlayerStatisticsInGame } from "~/models/statistics/PlayerStatisticsInGame";
import type { PlayerStatisticsInSeason } from "~/models/statistics/PlayerStatisticsInSeason";

export const useStatisticsStore = defineStore('statistics', {
    state: () => ({
        ofSeason: null as PlayerStatisticsInSeason | null,
        ofGame: null as PlayerStatisticsInGame[] | null,
        loading: false,
        error: null as string | null,
        lastUpdated: null as string | null,
    }),

    actions: {
        async fetchStatistics(payload: { seasonId: string; gameId: string; playerId: string }) {
            this.loading = true;
            this.error = null;

            const { $api } = useNuxtApp();

            try {
                const [seasonResponse, gameResponse] = await Promise.all([
                    $api.get<PlayerStatisticsInSeason>(`/statistics/seasons/${payload.seasonId}/players/${payload.playerId}`),
                    $api.get<PlayerStatisticsInGame[]>(`/statistics/games/${payload.gameId}/players/${payload.playerId}`)
                ]);

                if (seasonResponse.success && gameResponse.success) {
                    this.ofSeason = seasonResponse.payLoad;
                    this.ofGame = gameResponse.payLoad;
                    this.lastUpdated = new Date().toISOString();
                } else {
                    const errorMessage =
                        seasonResponse.message || gameResponse.message || 'Failed to fetch statistics';
                    this.error = errorMessage;
                }
            } catch (error: any) {
                this.error = error.message || 'An unexpected error occurred';
            } finally {
                this.loading = false;
            }
        },

        resetStatistics() {
            this.loading = false;
            this.ofSeason = null;
            this.ofGame = null;
            this.error = null;
            this.lastUpdated = null;
        },
    },
});