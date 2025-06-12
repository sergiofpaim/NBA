import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/Root';
import { Breadcrumbs } from '@mui/material';
import { Game } from '../models/Game';
import Link from '@mui/material/Link';

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

export class Breadcrumb {
    static generateDynamicBreadcrumbs(pathname: string, currentGame: Game | null, playerId: string, playerName: string) {
        const gameTitle = currentGame?.id ? `${currentGame.homeTeamId} vs ${currentGame.visitorTeamId}` : `Game ${currentGame?.id || ''}`;
        const playerTitle = playerName || `Player ${playerId}`;

        if (pathname.includes('/tracking')) {
            return [
                { title: 'Home', route: '/' },
                { title: 'Record', route: '/record' },
                { title: gameTitle, route: `/record/${currentGame?.id || ''}/participations` },
                { title: playerTitle, route: `/record/${currentGame?.id || ''}/participations/${playerId}/tracking` },
            ];
        }

        if (pathname.startsWith('/record') && pathname.includes('participations')) {
            return [
                { title: 'Home', route: '/' },
                { title: 'Record', route: '/record' },
                { title: gameTitle, route: `/record/${currentGame?.id || ''}/participations` },
            ];
        }

        return breadcrumbsMap[pathname as keyof typeof breadcrumbsMap] || breadcrumbsMap['/'];
    }
}

const BreadcrumbsManager: React.FC = () => {
    const currentGame = useSelector((state: RootState) => state.transactionGames.currentGame);
    const currentPlayer = useSelector((state: RootState) => state.transactionPlayers.currentPlayer);

    const router = useRouter();
    const pathname = usePathname();

    const [breadcrumb, setBreadcrumb] = useState<any[]>([]);

    useEffect(() => {
        const newBreadcrumb = Breadcrumb.generateDynamicBreadcrumbs(
            pathname,
            currentGame,
            currentPlayer?.playerId || '',
            currentPlayer?.playerName || ''
        );
        setBreadcrumb(newBreadcrumb);
    }, [pathname, currentGame, currentPlayer]);

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, color: 'primary.main', }} separator="›">
            {breadcrumb.map((item, index) => (
                <Link
                    key={index}
                    color="inherit"
                    onClick={(e) => {
                        e.preventDefault();
                        router.push(item.route);
                    }}
                    sx={{ cursor: 'pointer', fontWeight: 'bold', color: 'primary.main' }}
                >
                    {item.title}
                </Link>
            ))}
        </Breadcrumbs>
    );
};

export default BreadcrumbsManager;