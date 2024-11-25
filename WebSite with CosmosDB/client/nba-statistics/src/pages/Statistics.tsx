import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Divider, IconButton, Typography, useMediaQuery } from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../stores/Store';
import { fetchSeasons, fetchGames, fetchPlayers } from '../stores/Selection';
import globalTheme from '../styles/GlobalTheme';
import { Season } from '../models/Season';
import { Game } from '../models/Game';
import { Participation } from '../models/Participation';

const stats = [
  { label: 'PPG', value: '23.1' },
  { label: 'APG', value: '7.8' },
  { label: 'RPG', value: '10.5' },
  { label: 'BPG', value: '1.2' },
  { label: 'FT%', value: '88.3' },
  { label: 'Total Points', value: '435' },
];

const Statistics: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { seasons = [], loading: seasonsLoading, error: seasonsError } = useSelector((state: RootState) => state.seasons);
  const { games = [], loading: gamesLoading, error: gamesError } = useSelector((state: RootState) => state.games);
  const { players = [], loading: playersLoading, error: playersError } = useSelector((state: RootState) => state.players);

  const [selectedSeason, setSeason] = useState<Season | null>(null);
  const [selectedGame, setGame] = useState<Game | null>(null);
  const [selectedPlayer, setPlayer] = useState<Participation | null>(null);

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
    setSeason(selectedSeason || null);
    setGame(null); // Reset game when season changes
  };

  const handleGameChange = (event: SelectChangeEvent<string>) => {
    const selectedGameId = event.target.value;
    const selectedGame = games.find((game) => game.id === selectedGameId);
    setGame(selectedGame || null);
  };

  const handlePlayerChange = (event: SelectChangeEvent<string>) => {
    const selectedPlayerId = event.target.value;
    const selectedPlayer = players.find((player) => player.id === selectedPlayerId);
    setPlayer(selectedPlayer || null);
  };

  const isMobile = useMediaQuery('(max-width: 600px)');

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
            value={selectedGame?.id}
            label="Game"
            onChange={handleGameChange}
            disabled={!selectedSeason || gamesLoading}
          >
            {games.map((game) => (
              <MenuItem key={game.id} value={game.id}>
                {game.homeTeamId} vs {game.visitorTeamId}
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
            value={selectedPlayer?.id}
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
          sx={{
            width: '100%',
            fontSize: globalTheme.typography.h3,
            color: globalTheme.palette.background.default,
            height: 45,
            marginTop: 2,
            borderRadius: 4,
            backgroundColor: globalTheme.palette.primary.main,
            '&:hover': {
              backgroundColor: globalTheme.palette.primary.dark,
            },
          }}
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          paddingLeft: isMobile ? 0 : 4,
          gap: 2,
          marginTop: isMobile ? 3 : 0,
        }}>
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
            }}>
              <RefreshIcon />
            </IconButton>
            <Typography sx={{ fontSize: globalTheme.typography.h5 }}>Last updated <br /> 34s ago</Typography>
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
            In the season (40 games)
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 2,
            }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: globalTheme.palette.custom.overlay,
                  fontSize: 20,
                  padding: 1,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 20,
                    color: globalTheme.palette.grey[400],
                  }}
                >
                  {stat.label}:
                </Typography>
                <Typography
                  sx={{
                    fontSize: 20,
                    color: globalTheme.palette.primary.main,
                    fontWeight: 'bold',
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            ))}
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
            sx={{ marginBottom: isMobile ? 1 : 2 }}
          >
            In the game
          </Typography>
          <Box
            sx={{
              maxHeight: '300px',
              overflowY: 'auto',
              padding: 1,
              borderRadius: 1,
            }}
          >
            {[
              'Points ',
              'Assists ',
              'Fouls ',
              'Rebounds ',
              'Blocks ',
              'Turnovers ',
              'FT Attempt ',
              '2PT Attempt ',
              '3PT Attempt ',
              'FT% ',
              '2PT% ',
              '3PT% ',
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 16px',
                  fontSize: isMobile ? '1.2rem' : '1.5rem',
                  borderBottom:
                    index < 11 ? `1px solid ${globalTheme.palette.primary.main}` : 'none',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box >
  );
};

export default Statistics;