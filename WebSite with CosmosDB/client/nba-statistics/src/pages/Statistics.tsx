import React, { useEffect, useState } from 'react';
import { Box, InputLabel, MenuItem, FormControl, Select, Button, Divider, IconButton, Typography, useMediaQuery } from '@mui/material';
import { format } from 'date-fns';
import { SelectChangeEvent } from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../stores/Store';
import { fetchSeasons, fetchGames, fetchPlayers } from '../stores/Selection';
import globalTheme from '../styles/GlobalTheme';
import { fetchGameStatistics, fetchSeasonStatistics } from '../stores/Statistics';
import { PlayerStatisticsInSeason } from '../models/Statistics/PlayerStatisticsInSeason';
import StatBox from '../components/StatsBox';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Season } from '../models/Selection/Season';
import { Game } from '../models/Selection/Game';
import { Participation } from '../models/Selection/Participation';
import { PlayerStatisticsInGame } from '../models/Statistics/PlayerStatisticsInGame';

const Statistics: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { seasons = [], loading: seasonsLoading, error: seasonsError } = useSelector((state: RootState) => state.seasons);
  const { games = [], loading: gamesLoading, error: gamesError } = useSelector((state: RootState) => state.games);
  const { players = [], loading: playersLoading, error: playersError } = useSelector((state: RootState) => state.players);

  const { seasonStats, lastUpdated } = useSelector(
    (state: RootState) => state.seasonStats
  );
  const { gameStats = [] } = useSelector(
    (state: RootState) => state.gameStats
  );

  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Participation | null>(null);

  const [statsSeason, setSeasonStats] = useState<PlayerStatisticsInSeason | null>(null);
  const [statsGame, setGameStats] = useState<PlayerStatisticsInGame[] | null>(null);

  const [timeElapsed, setTimeElapsed] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchSeasons());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSeason) {
      dispatch(fetchGames(selectedSeason.id));
    }
  }, [dispatch, selectedSeason]);

  useEffect(() => {
    if (selectedGame) {
      dispatch(fetchPlayers(selectedGame.id));
    }
  }, [dispatch, selectedGame]);

  const handleSeasonChange = (event: SelectChangeEvent<string>) => {
    const selectedSeasonId = event.target.value;
    const selectedSeason = seasons.find((season) => season.id === selectedSeasonId);
    setSelectedSeason(selectedSeason || null);
    setSelectedGame(null);
    setSelectedPlayer(null);
    setSeasonStats(null);
  };

  const handleGameChange = (event: SelectChangeEvent<string>) => {
    const selectedGameId = event.target.value;
    const selectedGame = games.find((game) => game.id === selectedGameId);
    setSelectedGame(selectedGame || null);
    setSelectedPlayer(null);
    setSeasonStats(null);
  };

  const handlePlayerChange = (event: SelectChangeEvent<string>) => {
    const selectedPlayerId = event.target.value;
    const selectedPlayer = players.find((player) => player.id === selectedPlayerId);
    setSelectedPlayer(selectedPlayer || null);
    setSeasonStats(null);
  };

  const handleSeasonStats = () => {
    if (selectedSeason && selectedGame && selectedPlayer) {
      dispatch(fetchSeasonStatistics(selectedSeason.id, selectedPlayer.id));
    }
  };

  const handleGameStats = () => {
    if (selectedSeason && selectedGame && selectedPlayer) {
      dispatch(fetchGameStatistics(selectedGame.id, selectedPlayer.id));
    }
  };

  useEffect(() => {
    if (seasonStats) {
      setSeasonStats(seasonStats);
    }
    if (gameStats) {
      setGameStats(gameStats)
    }
  }, [seasonStats, gameStats]);

  useEffect(() => {
    if (lastUpdated) {
      const intervalId = setInterval(() => {
        const secondsElapsed = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 1000);
        setTimeElapsed(secondsElapsed);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [lastUpdated]);

  useEffect(() => {
    if (timeElapsed === null || timeElapsed >= 60) {
      handleSeasonStats();
      handleGameStats();
    }
  }, [timeElapsed]);

  const isMobile = useMediaQuery('(max-width: 450px)');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'flex-start',
        gap: 2,
        position: 'absolute',
        top: '50%',
        left: isMobile ? '2%' : '5%',
        transform: 'translateY(-50%)',
        width: isMobile ? '96%' : '90%',
        paddingTop: isMobile ? '80px' : '120px',
        paddingBottom: isMobile ? '50px' : '120px',
        overflowY: 'auto',
        maxHeight: '100vh',
      }}
    >
      <Box
        sx={{
          width: isMobile ? '100%' : '20%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          marginTop: isMobile ? 12 : 0,
          paddingRight: isMobile ? 2 : 0,
          paddingLeft: isMobile ? 2 : 0
        }}
      >
        <Typography gutterBottom sx={{ ...globalTheme.typography.h2 }}>Pick a player</Typography>
        <FormControl fullWidth>
          <InputLabel id="season-label" sx={{ color: globalTheme.palette.primary.main }}>Season</InputLabel>
          <Select
            labelId="season-label"
            id="season-select"
            value={selectedSeason?.id}
            label="Season"
            onChange={handleSeasonChange}
            disabled={seasonsLoading}
          >
            {seasons.map((season) => (
              <MenuItem key={season.id} value={season.id}>
                {season.id}
              </MenuItem>
            ))}
          </Select>
          {seasonsError && <div>Error: {seasonsError}</div>}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="game-label" sx={{ color: globalTheme.palette.primary.main }}>Game</InputLabel>
          <Select
            labelId="game-label"
            id="game-select"
            value={selectedGame?.id || ''}
            label="Game"
            onChange={handleGameChange}
            disabled={!selectedSeason || gamesLoading}
          >
            {games.map((game) => (
              <MenuItem key={game.id} value={game.id}>
                {game.homeTeamId} vs {game.visitorTeamId}, {format(game.at, 'MMM dd')}
              </MenuItem>
            ))}
          </Select>
          {gamesError && <div>Error: {gamesError}</div>}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="player-label" sx={{ color: globalTheme.palette.primary.main }}>Player</InputLabel>
          <Select
            labelId="player-label"
            id="player-select"
            value={selectedPlayer?.id || ''}
            label="Player"
            onChange={handlePlayerChange}
            disabled={!selectedGame || playersLoading}
          >
            {players.map((player) => (
              <MenuItem key={player.id} value={player.id}>
                {player.name}
              </MenuItem>
            ))}
          </Select>
          {playersError && <div>Error: {playersError}</div>}
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          startIcon={<QueryStatsIcon />}
          disabled={!!statsSeason || (!selectedSeason || !selectedGame || !selectedPlayer)}
          sx={{
            width: '100%',
            fontSize: globalTheme.typography.h3,
            color: globalTheme.palette.background.default,
            height: 45,
            marginTop: 2,
            borderRadius: 4,
            backgroundColor: globalTheme.palette.primary.main,
            '&:hover': {
              backgroundColor: globalTheme.palette.primary.dark
            },
            '&.Mui-disabled': {
              color: 'black',
              backgroundColor: globalTheme.palette.grey[700],
            }
          }}
          onClick={() => {
            handleSeasonStats();
            handleGameStats();
          }}>
          FILTER
        </Button>
      </Box>
      <Divider
        orientation={isMobile ? 'vertical' : 'horizontal'}
        flexItem
        sx={{ marginLeft: isMobile ? 0 : 2, marginRight: isMobile ? 0 : 2, borderColor: globalTheme.palette.primary.main, borderWidth: 2, marginTop: isMobile ? 4 : 0 }}
      />
      <Box
        sx={{
          width: isMobile ? '100%' : '75%',
          height: '650',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          paddingLeft: isMobile ? 0 : 4,
          gap: 2,
          marginTop: isMobile ? 3 : 0,
        }}>
        {statsSeason ? (
          <>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Typography sx={{ fontSize: globalTheme.typography.h2 }} gutterBottom>
                Performance
              </Typography>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1
              }}>
                <IconButton aria-label="refresh" sx={{
                  color: globalTheme.palette.background.default, backgroundColor: globalTheme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: globalTheme.palette.primary.dark
                  }
                }}
                  onClick={() => {
                    handleSeasonStats();
                    handleGameStats();
                  }}                >
                  <RefreshIcon />
                </IconButton>
                <Typography sx={{ fontSize: globalTheme.typography.h5 }}>Updated <br />{timeElapsed !== null ? `${timeElapsed}s ago` : "Never"}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                width: 'auto',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                padding: 2,
                display: 'grid',
                gridTemplateRows: '1fr auto',
                gap: 2,
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h2"}
                gutterBottom
                textAlign="center"
              >
                In the season ({statsSeason?.participations && statsSeason.participations > 0 ? `${statsSeason.participations} game${statsSeason.participations > 1 ? 's' : ''}` : '0 games'})
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: 2,
                  marginTop: 2,
                  '@media (max-width: 400px)': {
                    gridTemplateColumns: '1fr',
                  },
                }}
              >
                <StatBox label="PPG" value={statsSeason.ppg?.toFixed(1)} />
                <StatBox label="APG" value={statsSeason.apg?.toFixed(1)} />
                <StatBox label="RPG" value={statsSeason.rpg?.toFixed(1)} />
                <StatBox label="BPG" value={statsSeason.bpg?.toFixed(1)} />
                <StatBox label="FT%" value={statsSeason.ftConversion?.toFixed(1)} />
                <StatBox label="Total Points" value={statsSeason.totalPoints} />
              </Box>
            </Box>
            <Box
              sx={{
                width: 'auto',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                padding: 2,
                borderRadius: 1,
              }}
            >
              <Typography
                variant={isMobile ? 'h5' : 'h2'}
                gutterBottom
                textAlign="center"
                sx={{
                  marginBottom: isMobile ? 1 : 2, gridTemplateColumns: isMobile ? '1fr' : 'repeat(8, 1fr)',
                }}
              >
                In the game
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(8, 1fr)',
                  gap: 2,
                  marginTop: 2,
                }}
              >
                <StatBox label="FT" value={`${statsGame?.find(t => t.type === 'FreeThrowHit')?.count ?? 0}-${statsGame?.filter(t => t.type === 'FreeThrowMiss' || t.type === 'FreeThrowHit')?.reduce((sum, t) => sum + t.count, 0) ?? 0}`} />
                <StatBox label="2PT" value={`${statsGame?.find(t => t.type === 'TwoPointerHit')?.count ?? 0}-${statsGame?.filter(t => t.type === 'TwoPointerMiss' || t.type === 'TwoPointerHit')?.reduce((sum, t) => sum + t.count, 0) ?? 0}`} />
                <StatBox label="3PT" value={`${statsGame?.find(t => t.type === 'ThreePointerHit')?.count ?? 0}-${statsGame?.filter(t => t.type === 'ThreePointerMiss' || t.type === 'ThreePointerHit')?.reduce((sum, t) => sum + t.count, 0) ?? 0}`} />
                <StatBox label="Assist" value={statsGame?.find(t => t.type === "Assist")?.count ?? 0} />
                <StatBox label="Rebound" value={statsGame?.find(t => t.type === "Rebound")?.count ?? 0} />
                <StatBox label="Turnover" value={statsGame?.find(t => t.type === "Turnover")?.count ?? 0} />
                <StatBox label="Block" value={statsGame?.find(t => t.type === "Block")?.count ?? 0} />
                <StatBox label="Foul" value={statsGame?.find(t => t.type === "Foul")?.count ?? 0} />
                <StatBox
                  position="center"
                  label="Total Points"
                  sx={{
                    gridColumn: isMobile ? 'auto' : 'span 8',
                    boxWidth: isMobile ? "auto" : "500px"
                  }}
                  value={statsGame?.reduce((total, t) => t.points ? total + t.points : total, 0) ?? 0}
                />
              </Box>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              height: isMobile ? '100' : '550px',
              borderRadius: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Typography
              variant="h1"
              align="center"
              gutterBottom
              sx={{
                ...globalTheme.typography.h2
              }}
            >
              {isMobile ? 'Fill the filtering fields to the top' : 'Fill the filtering fields to the left'}
            </Typography>
          </Box>

        )}
      </Box>
    </Box >
  );
};

export default Statistics;