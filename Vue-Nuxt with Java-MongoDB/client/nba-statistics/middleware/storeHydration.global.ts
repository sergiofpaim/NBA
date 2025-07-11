export default defineNuxtRouteMiddleware(async (to) => {
    const store = useTransactionStore();

    if (Object.keys(to.params).length > 0) {
        const params: Record<string, string> = Object.fromEntries(
            Object.entries(to.params).map(([key, value]) => [
                key,
                Array.isArray(value) ? value.join(',') : value
            ])
        );
        await store.hydrateFromRoute(params);
    }
    else
        await store.hydrateFromRoute();
});