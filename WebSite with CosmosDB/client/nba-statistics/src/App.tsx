import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import store, { AppDispatch } from './stores/Store';
import globalTheme from './styles/GlobalTheme';
import Home from './pages/Home';
import Statistics from './pages/Statistics';
import Record from './pages/Record';
import Participations from './pages/Participations';
import Tracking from './pages/Tracking';
import GlobalLayout from './styles/GlobalLayout';
import { setCurrentGame, fetchGames, fetchTeams, fetchPlayers, setCurrentPlayerOfGame, fetchParticipation, setParticipation } from './stores/Transaction';
import { RootState } from './stores/Store';
import { useNavigate } from 'react-router-dom';
import { Game } from './models/Game';

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

const generateDynamicBreadcrumbs = (pathname: string, currentGame: Game | null, playerId: string, playerName: string) => {

  const gameTitle = currentGame && currentGame.id
    ? `${currentGame.homeTeamId} vs ${currentGame.visitorTeamId}`
    : `Game ${currentGame?.id || ""}`;

  const playerTitle = playerName || `Player ${playerId}`;

  if (pathname.startsWith('/record/') && pathname.includes('/participations/') && pathname.includes('/tracking')) {
    return [
      { title: 'Home', route: '/' },
      { title: 'Record', route: '/record' },
      { title: gameTitle, route: `/record/${currentGame?.id || ""}/participations` },
      { title: playerTitle, route: `/record/${currentGame?.id || ""}/participations/${playerId}/tracking` },
    ];
  }

  if (pathname.startsWith('/record/')) {
    return [
      { title: 'Home', route: '/' },
      { title: 'Record', route: '/record' },
      { title: gameTitle, route: `/record/${currentGame?.id || ""}/participations` },
    ];
  }

  return breadcrumbsMap[pathname as keyof typeof breadcrumbsMap] || breadcrumbsMap['/'];
};

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
  const currentPlayer = useSelector((state: RootState) => state.transactionPlayers.currentPlayer);

  const playersParticipating = useSelector((state: RootState) => state.transactionPlayers.players);

  const [playerName, setPlayerName] = useState<string>('');
  const [breadcrumb, setBreadcrumb] = useState<any[]>([]);

  const prevGameRef = useRef<any>();
  const prevPlayerRef = useRef<string>();

  useEffect(() => {
    dispatch(fetchGames());
    dispatch(fetchTeams());
    setCurrentGame(null);
    setCurrentPlayerOfGame(null);
    dispatch(setParticipation(null))
  }, [dispatch]);

  useEffect(() => {
    if (currentGame?.id && currentGame?.id !== prevGameRef.current?.id) {
      navigate(`/record/${currentGame.id}/participations`);
      prevGameRef.current = currentGame;
    }
  }, [currentGame, navigate]);

  useEffect(() => {
    if (currentPlayer?.playerId && currentPlayer?.playerId !== prevPlayerRef.current) {
      navigate(`/record/${currentGame?.id}/participations/${currentPlayer?.playerId}/tracking`);
      prevPlayerRef.current = currentPlayer?.playerId;
    }
  }, [currentPlayer, currentGame, navigate]);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchPlayers({ gameId: gameId ?? "" }));
    }
  }, [dispatch, gameId]);

  useEffect(() => {
    if (games.length && gameId) {
      dispatch(setCurrentGame(games.find(game => game.id === gameId) || null));
    }
  }, [dispatch, games, gameId]);

  useEffect(() => {
    if (playersParticipating) {
      dispatch(setCurrentPlayerOfGame(playersParticipating.find(p => p.playerId === playerId)));
    }
  }, [dispatch, playersParticipating, playerId]);

  useEffect(() => {
    if (gameId && playerId) {
      dispatch(fetchParticipation({ gameId: gameId, playerId: playerId }));
    }
  }, [dispatch, playerId, gameId]);

  useEffect(() => {
    if (gameId && games.length && playerId && teams.length > 0) {
      const game = games.find(game => game.id === gameId);
      if (game) {
        const homeTeam = teams.find(team => team.teamId === game.homeTeamId);
        const visitorTeam = teams.find(team => team.teamId === game.visitorTeamId);
        if (homeTeam && visitorTeam) {
          const playersOfTheCurrentGame = [
            ...(homeTeam.players || []),
            ...(visitorTeam.players || []),
          ];
          const player = playersOfTheCurrentGame.find(p => p.playerId === playerId);
          if (player) {
            setPlayerName(player.playerName || '');
          }
        }
      }
    }
  }, [gameId, games, playerId, teams]);

  useEffect(() => {
    const newBreadcrumb = generateDynamicBreadcrumbs(location.pathname, currentGame, playerId, playerName);
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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={globalTheme}>
        <Router>
          <BreadcrumbsController />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;