import React, { useCallback, useEffect, useState } from 'react';
import { Box, InputLabel, MenuItem, FormControl, Select, Button, Divider, IconButton, Typography, useMediaQuery } from '@mui/material';
import { format } from 'date-fns';
import { SelectChangeEvent } from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import globalTheme from '../styles/GlobalTheme';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import RefreshIcon from '@mui/icons-material/Refresh';
import { RootState, AppDispatch } from '../stores/Store';
import { fetchSeasons, fetchGames, fetchPlayers } from '../stores/Selection';
import { fetchStatistics, resetStatistics } from '../stores/Statistics';
import { Season } from '../models/Selection/Season';
import { Game } from '../models/Selection/Game';
import { Participation } from '../models/Selection/Participation';
import StatBox from '../components/StatsBox';

const Statistics: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const selectSeasons = (state: RootState) => state.seasons.seasons;
  const selectGames = (state: RootState) => state.games.games;
  const selectPlayers = (state: RootState) => state.players.players;
  const selectStatistics = (state: RootState) => state.statistics;
  const selectError = (state: RootState) => state.statistics.error || state.seasons.error || state.games.error || state.players.error;

  const selectStatisticsData = createSelector(
    [selectSeasons, selectGames, selectPlayers, selectStatistics, selectError],
    (seasons, games, players, statistics, error) => ({
      seasons,
      games,
      players,
      statistics,
      error
    })
  );

  const { seasons, games, players, statistics, error } = useSelector((state: RootState) => selectStatisticsData(state));

  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Participation | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number | null>(null);

  const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));

  const handleSeasonChange = (event: SelectChangeEvent<string>) => {
    const selectedSeasonId = event.target.value;
    const selectedSeason = seasons.find((s) => s.id === selectedSeasonId);
    setSelectedSeason(selectedSeason || null);
    setSelectedGame(null);
    setSelectedPlayer(null);
    dispatch(resetStatistics());
    setTimeElapsed(null);
  };

  const handleGameChange = (event: SelectChangeEvent<string>) => {
    const selectedGameId = event.target.value;
    const selectedGame = games.find((game) => game.id === selectedGameId);
    setSelectedGame(selectedGame || null);
    setSelectedPlayer(null);
    dispatch(resetStatistics());
    setTimeElapsed(null);
  };

  const handlePlayerChange = (event: SelectChangeEvent<string>) => {
    const selectedPlayerId = event.target.value;
    const selectedPlayer = players.find((player) => player.id === selectedPlayerId);
    setSelectedPlayer(selectedPlayer || null);
    dispatch(resetStatistics());
    setTimeElapsed(null);
  };

  const handleStats = useCallback(() => {
    if (selectedSeason && selectedGame && selectedPlayer) {
      dispatch(fetchStatistics(selectedSeason.id, selectedGame.id, selectedPlayer.id));
      setTimeElapsed(null);
    }
  }, [dispatch, selectedGame, selectedPlayer, selectedSeason]);

  useEffect(() => {
    dispatch(fetchSeasons());
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetStatistics());
    setSelectedSeason(null);
    setSelectedGame(null);
    setSelectedPlayer(null);
    setTimeElapsed(null);
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

  useEffect(() => {
    if (statistics.lastUpdated) {
      const lastUpdatedDate = statistics.lastUpdated ? new Date(statistics.lastUpdated) : null;
      const intervalId = setInterval(() => {
        const secondsElapsed = Math.floor((Date.now() - (lastUpdatedDate?.getTime() || 0)) / 1000);
        setTimeElapsed(secondsElapsed);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [statistics.lastUpdated]);

  useEffect(() => {
    if ((timeElapsed || 0) >= 60) {
      handleStats();
    }
  }, [handleStats, timeElapsed]);

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
        {error ? (
          <Typography gutterBottom sx={{ ...globalTheme.typography.h2 }}>{error}</Typography>) : ('')
        }
        <FormControl fullWidth>
          <InputLabel id="season-label" sx={{ color: globalTheme.palette.primary.main }}>Season</InputLabel>
          <Select
            labelId="season-label"
            id="season-select"
            value={selectedSeason?.id || ''}
            label="Season"
            onChange={handleSeasonChange}
            disabled={statistics.loading}
          >
            {seasons?.map((season) => (
              <MenuItem key={season.id} value={season.id}>
                {season.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="game-label" sx={{ color: globalTheme.palette.primary.main }}>Game</InputLabel>
          <Select
            labelId="game-label"
            id="game-select"
            value={selectedGame?.id || ''}
            label="Game"
            onChange={handleGameChange}
            disabled={!selectedSeason}
          >
            {games.map((game) => (
              <MenuItem key={game.id} value={game.id}>
                {game.homeTeamId} vs {game.visitorTeamId}, {format(game.at, 'MMM dd')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="player-label" sx={{ color: globalTheme.palette.primary.main }}>Player</InputLabel>
          <Select
            labelId="player-label"
            id="player-select"
            value={selectedPlayer?.id || ''}
            label="Player"
            onChange={handlePlayerChange}
            disabled={!selectedGame}
          >
            {players.map((player) => (
              <MenuItem key={player.id} value={player.id}>
                {player.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          startIcon={<QueryStatsIcon />}
          disabled={!!statistics.ofGame || (!selectedSeason || !selectedGame || !selectedPlayer)}
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
          onClick={handleStats}
        >
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
        {statistics.ofGame || statistics.ofSeason ? (
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
                  onClick={handleStats}
                >
                  <RefreshIcon />
                </IconButton>
                <Typography sx={{ fontSize: globalTheme.typography.h5 }}>Updated <br />{timeElapsed !== null ? `${timeElapsed}s ago` : "now"}
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
                In the season ({statistics.ofSeason?.participations && statistics.ofSeason.participations > 0 ? `${statistics.ofSeason.participations} game${statistics.ofSeason.participations > 1 ? 's' : ''}` : '0 games'})
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
                <StatBox label="PPG" value={statistics.ofSeason?.ppg?.toFixed(1) || ''} />
                <StatBox label="APG" value={statistics.ofSeason?.apg?.toFixed(1) || ''} />
                <StatBox label="RPG" value={statistics.ofSeason?.rpg?.toFixed(1) || ''} />
                <StatBox label="BPG" value={statistics.ofSeason?.bpg?.toFixed(1) || ''} />
                <StatBox label="FT%" value={statistics.ofSeason?.ftConversion?.toFixed(1) || ''} />
                <StatBox label="Total Points" value={statistics.ofSeason?.totalPoints || ''} />
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
                <StatBox label="FT" value={`${statistics.ofGame?.find(t => t.type === 'FreeThrowHit')?.count ?? 0}-${statistics.ofGame?.filter(t => t.type === 'FreeThrowMiss' || t.type === 'FreeThrowHit')?.reduce((sum, t) => sum + t.count, 0) ?? 0}`} />
                <StatBox label="2PT" value={`${statistics.ofGame?.find(t => t.type === 'TwoPointerHit')?.count ?? 0}-${statistics.ofGame?.filter(t => t.type === 'TwoPointerMiss' || t.type === 'TwoPointerHit')?.reduce((sum, t) => sum + t.count, 0) ?? 0}`} />
                <StatBox label="3PT" value={`${statistics.ofGame?.find(t => t.type === 'ThreePointerHit')?.count ?? 0}-${statistics.ofGame?.filter(t => t.type === 'ThreePointerMiss' || t.type === 'ThreePointerHit')?.reduce((sum, t) => sum + t.count, 0) ?? 0}`} />
                <StatBox label="Assist" value={statistics.ofGame?.find(t => t.type === "Assist")?.count ?? 0} />
                <StatBox label="Rebound" value={statistics.ofGame?.find(t => t.type === "Rebound")?.count ?? 0} />
                <StatBox label="Turnover" value={statistics.ofGame?.find(t => t.type === "Turnover")?.count ?? 0} />
                <StatBox label="Block" value={statistics.ofGame?.find(t => t.type === "Block")?.count ?? 0} />
                <StatBox label="Foul" value={statistics.ofGame?.find(t => t.type === "Foul")?.count ?? 0} />
                <StatBox
                  position="center"
                  label="Total Points"
                  sx={{
                    gridColumn: isMobile ? 'auto' : 'span 8',
                    boxWidth: isMobile ? "auto" : "500px"
                  }}
                  value={statistics.ofGame?.reduce((total, t) => t.points ? total + t.points : total, 0) ?? 0}
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