import { Game } from '../models/Game';

const breadcrumbsMap = {
    '/': [{ title: 'Home', route: '/' }],
    '/statistics': [
        { title: 'Home', route: '/' },
        { title: 'Statistics', route: '/statistics' },
    ],
    '/record': [
        { title: 'Home', route: '/' },
        { title: 'Record', route: '/record' },
    ],
    '/record/:gameId/participations': [
        { title: 'Home', route: '/' },
        { title: 'Record', route: '/record' },
        { title: 'Participations', route: '/record/:gameId/participations' },
    ],
    '/record/:gameId/participations/:playerId/tracking': [
        { title: 'Home', route: '/' },
        { title: 'Record', route: '/record' },
        { title: 'Participations', route: '/record/:gameId/participations' },
        { title: 'Tracking', route: '/record/:gameId/participations/:playerId/tracking' },
    ],
};

export class BreadcrumbService {
    static generateDynamicBreadcrumbs(
        pathname: string,
        currentGame: Game | null,
        playerId: string,
        playerName: string
    ) {
        const gameTitle = currentGame && currentGame.id
            ? `${currentGame.homeTeamId} vs ${currentGame.visitorTeamId}`
            : `Game ${currentGame?.id || ''}`;

        const playerTitle = playerName || `Player ${playerId}`;

        if (pathname.startsWith('/record/')) {
            return [
                { title: 'Home', route: '/' },
                { title: 'Record', route: '/record' },
                { title: gameTitle, route: `/record/${currentGame?.id || ''}/participations` },
            ];
        }

        if (pathname.includes('/tracking')) {
            return [
                { title: 'Home', route: '/' },
                { title: 'Record', route: '/record' },
                { title: gameTitle, route: `/record/${currentGame?.id || ''}/participations` },
                { title: playerTitle, route: `/record/${currentGame?.id || ''}/participations/${playerId}/tracking` },
            ];
        }

        return breadcrumbsMap[pathname as keyof typeof breadcrumbsMap] || breadcrumbsMap['/'];
    }
}