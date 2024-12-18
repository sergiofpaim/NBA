import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../stores/Store';
import { loadGames, loadTeams, setCurrentGame, setParticipation, setCurrentPlayerOfGame, fetchParticipation, loadPlayers } from '../stores/Transaction';
import { RootState } from '../stores/Store';
import GlobalLayout from '../styles/GlobalLayout';
import Home from '../pages/Home';
import Statistics from '../pages/Statistics';
import Record from '../pages/Record';
import Participations from '../pages/Participations';
import Tracking from '../pages/Tracking';
import { BreadcrumbService } from '../services/BreadCrumbService';

const BreadcrumbsController: React.FC = () => {
    const location = useLocation();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const splits = location.pathname.split('/');
    const gameId = splits[2];
    const playerId = splits[4];

    const games = useSelector((state: RootState) => state.transactionGames.games);
    const teams = useSelector((state: RootState) => state.transactionTeams.teams);
    const currentGame = useSelector((state: RootState) => state.transactionGames.currentGame);
    const playersParticipating = useSelector((state: RootState) => state.transactionPlayers.players);

    const [playerName, setPlayerName] = useState<string>('');
    const [breadcrumb, setBreadcrumb] = useState<any[]>([]);

    const prevGameRef = useRef<any>();

    useEffect(() => {
        dispatch(loadGames());
        dispatch(loadTeams());
        dispatch(setCurrentGame(null));
        dispatch(setCurrentPlayerOfGame(null));
        dispatch(setParticipation(null));
    }, [dispatch]);

    useEffect(() => {
        if (gameId) {
            dispatch(loadPlayers({ gameId: gameId ?? '' }));
        }
    }, [dispatch, gameId]);

    useEffect(() => {
        if (games.length && gameId) {
            dispatch(setCurrentGame(games.find((game) => game.id === gameId) || null));
        }
    }, [dispatch, games, gameId]);

    useEffect(() => {
        if (playersParticipating) {
            dispatch(setCurrentPlayerOfGame(playersParticipating.find((p) => p.playerId === playerId)));
        }
    }, [dispatch, playersParticipating, playerId]);

    useEffect(() => {
        if (gameId && playerId) {
            dispatch(fetchParticipation({ gameId: gameId, playerId: playerId }));
        }
    }, [dispatch, playerId, gameId]);

    useEffect(() => {
        if (gameId && games.length && playerId && teams.length > 0) {
            const game = games.find((game) => game.id === gameId);
            if (game) {
                const homeTeam = teams.find((team) => team.teamId === game.homeTeamId);
                const visitorTeam = teams.find((team) => team.teamId === game.visitorTeamId);
                if (homeTeam && visitorTeam) {
                    const playersOfTheCurrentGame = [...(homeTeam.players || []), ...(visitorTeam.players || [])];
                    const player = playersOfTheCurrentGame.find((p) => p.playerId === playerId);
                    if (player) {
                        setPlayerName(player.playerName || '');
                    }
                }
            }
        }
    }, [gameId, games, playerId, teams]);

    useEffect(() => {
        if (
            currentGame?.id &&
            currentGame?.id !== prevGameRef.current?.id &&
            new Date(currentGame.at) <= new Date() &&
            !location.pathname.includes('tracking')
        ) {
            navigate(`/record/${currentGame.id}/participations`);
            prevGameRef.current = currentGame;
        }
    }, [currentGame, location.pathname, navigate]);

    useEffect(() => {
        const newBreadcrumb = BreadcrumbService.generateDynamicBreadcrumbs(location.pathname, currentGame, playerId, playerName);
        setBreadcrumb(newBreadcrumb);
    }, [playerName, location.pathname, currentGame, playerId]);

    return (
        <GlobalLayout breadcrumb={breadcrumb}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/record" element={<Record />} />
                <Route path="/record/:gameId/participations" element={<Participations />} />
                <Route path="/record/:gameId/participations/:playerId/tracking" element={<Tracking />} />
            </Routes>
        </GlobalLayout>
    );
};

export default BreadcrumbsController;