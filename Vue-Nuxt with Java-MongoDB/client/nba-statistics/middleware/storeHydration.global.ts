export default defineNuxtRouteMiddleware(async (to) => {
    const transactionStore = useTransactionStore();
    const selectionStore = useSelectionStore();

    const hydrateFromRoute = async (params?: Record<string, string>) => {
        transactionStore.resetLoadingStates();

        if (to.path === '/statistics') {
            selectionStore.fetchSeasons();
        } else {
            try {
                await Promise.all([
                    transactionStore.loadGames(),
                    transactionStore.loadTeams(),
                ]);

                if (params && params.gameId) {
                    await transactionStore.hydrateGameData(params.gameId);

                    if (params.playerId) {
                        await transactionStore.hydratePlayerData(params.gameId, params.playerId);
                    }
                }
            } catch (error) {
                console.error('Hydration error:', error);
            }
        }
    };

    if (Object.keys(to.params).length > 0) {
        const params: Record<string, string> = Object.fromEntries(
            Object.entries(to.params).map(([key, value]) => [
                key,
                Array.isArray(value) ? value.join(',') : value
            ])
        );
        await hydrateFromRoute(params);
    } else {
        await hydrateFromRoute();
    }
});