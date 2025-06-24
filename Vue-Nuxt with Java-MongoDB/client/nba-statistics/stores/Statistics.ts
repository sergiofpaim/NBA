// stores/statistics.ts
import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import type { PlayerStatisticsInSeason } from '~/models/Statistics/PlayerStatisticsInSeason'
import type { PlayerStatisticsInGame } from '~/models/Statistics/PlayerStatisticsInGame'

export interface StatisticsState {
    ofSeason: PlayerStatisticsInSeason | null
    ofGame: PlayerStatisticsInGame[] | null
    loading: boolean
    error: string | null
    lastUpdated: string | null
}

export const useStatisticsStore = defineStore('statistics', {
    state: (): StatisticsState => ({
        ofSeason: null,
        ofGame: null,
        loading: false,
        error: null,
        lastUpdated: null,
    }),

    actions: {
        resetStatistics() {
            this.ofSeason = null
            this.ofGame = null
            this.loading = false
            this.error = null
            this.lastUpdated = null
        },

        async fetchStatistics(payload: { seasonId: string; gameId: string; playerId: string }) {
            this.loading = true
            this.error = null
            const { $api } = useNuxtApp()

            try {
                const [seasonRes, gameRes] = await Promise.all([
                    $api.get<PlayerStatisticsInSeason>(`/statistics/seasons/${payload.seasonId}/players/${payload.playerId}`),
                    $api.get<PlayerStatisticsInGame[]>(`/statistics/games/${payload.gameId}/players/${payload.playerId}`),
                ])

                if (seasonRes.success && gameRes.success) {
                    this.ofSeason = seasonRes.payLoad
                    this.ofGame = gameRes.payLoad
                    this.lastUpdated = new Date().toISOString()
                } else {
                    const message = seasonRes.message || gameRes.message || 'Failed to fetch statistics'
                    this.error = message
                }
            } catch (err: any) {
                this.error = err?.message || 'Failed to fetch statistics'
            } finally {
                this.loading = false
            }
        },
    },
})
