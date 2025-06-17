import { defineStore } from 'pinia'
import { Season } from '@/models/Season'
import { Game } from '@/models/Game'
import { ParticipatingPlayer } from '@/models/ParticipatingPlayer'

interface State {
    seasons: Season[]
    games: Game[]
    players: ParticipatingPlayer[]
    error: string | null
}

export const useSelectionStore = defineStore('selection', {
    state: (): State => ({
        seasons: [],
        games: [],
        players: [],
        error: null
    }),

    actions: {
        async fetchSeasons() {
            try {
                this.error = null
                const { $api } = useNuxtApp()

                const response = await $api.get<Season[]>('/transaction/seasons')
                if (response.success) {
                    this.seasons = response.payLoad
                    this.games = []
                    this.players = []
                } else {
                    this.error = response.message
                }
            } catch (err) {
                this.error = 'Unexpected error fetching seasons'
            }
        },

        async fetchSelectionGames(seasonId: string) {
            try {
                this.error = null
                const { $api } = useNuxtApp()

                const response = await $api.get<Game[]>(`/transaction/seasons/${seasonId}/games`)
                if (response.success) {
                    this.games = response.payLoad
                    this.players = []
                } else {
                    this.error = response.message
                }
            } catch (err) {
                this.error = 'Unexpected error fetching selection games'
            }
        },

        async fetchPlayers(gameId: string) {
            try {
                this.error = null
                const { $api } = useNuxtApp()

                const response = await $api.get<ParticipatingPlayer[]>(`/transaction/games/${gameId}/players`)
                if (response.success) {
                    this.players = response.payLoad
                } else {
                    this.error = response.message
                }
            } catch (err) {
                this.error = 'Unexpected error fetching players'
            }
        },

        resetGames() {
            this.games = []
        },

        resetPlayers() {
            this.players = []
        }
    }
})