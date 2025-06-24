import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch, RootState } from '../stores/Store';
import { loadGames, loadTeams, setCurrentGame, setParticipation, setCurrentPlayerOfGame, fetchParticipation, loadPlayers } from '../stores/Transaction';

interface UrlParamContextProps {
    playerName: string;
    currentGame: any;
    currentPlayer: any;
    playerId: string | null;
    gameId: string | null;
}

const UrlParamContext = createContext<UrlParamContextProps | undefined>(undefined);

export const UrlParamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch: AppDispatch = useDispatch();

    const { gameId, playerId } = useParams();

    const gameIdString = Array.isArray(gameId) ? gameId[0] : gameId;
    const playerIdString = Array.isArray(playerId) ? playerId[0] : playerId;

    const games = useSelector((state: RootState) => state.transactionGames.games);
    const teams = useSelector((state: RootState) => state.transactionTeams.teams);

    const playersParticipating = useSelector((state: RootState) => state.transactionPlayers.players);
    const currentGame = useSelector((state: RootState) => state.transactionGames.currentGame);

    const [playerName, setPlayerName] = useState<string>('');

    useEffect(() => {
        dispatch(loadGames());
        dispatch(loadTeams());
        dispatch(setCurrentGame(null));
        dispatch(setCurrentPlayerOfGame(null));
        dispatch(setParticipation(null));
    }, [dispatch]);

    useEffect(() => {
        if (gameIdString) {
            dispatch(loadPlayers({ gameId: gameIdString ?? '' }));
        }
    }, [dispatch, gameIdString]);

    useEffect(() => {
        if (games.length && gameIdString) {
            dispatch(setCurrentGame(games.find((game) => game.id === gameIdString) || null));
        }
    }, [dispatch, games, gameIdString]);

    useEffect(() => {
        if (playersParticipating) {
            dispatch(setCurrentPlayerOfGame(playersParticipating.find((p) => p.playerId === playerIdString)));
        }
    }, [dispatch, playersParticipating, playerIdString]);

    useEffect(() => {
        if (gameIdString && playerIdString) {
            dispatch(fetchParticipation({ gameId: gameIdString, playerId: playerIdString }));
        }
    }, [dispatch, playerIdString, gameIdString]);

    useEffect(() => {
        if (gameIdString && games.length && playerIdString && teams.length > 0) {
            const game = games.find((game) => game.id === gameIdString);
            if (game) {
                const homeTeam = teams.find((team) => team.teamId === game.homeTeamId);
                const visitorTeam = teams.find((team) => team.teamId === game.visitorTeamId);
                if (homeTeam && visitorTeam) {
                    const playersOfTheCurrentGame = [...(homeTeam.players || []), ...(visitorTeam.players || [])];
                    const player = playersOfTheCurrentGame.find((p) => p.playerId === playerIdString);
                    if (player) {
                        setPlayerName(player.playerName || '');
                    }
                }
            }
        }
    }, [gameIdString, games, playerIdString, teams]);

    const contextValue = {
        playerName,
        currentGame,
        currentPlayer: playersParticipating?.find((p) => p.playerId === playerIdString),
        playerId: playerIdString || null,
        gameId: gameIdString || null,
    };

    return <UrlParamContext.Provider value={contextValue}>{children}</UrlParamContext.Provider>;
};
