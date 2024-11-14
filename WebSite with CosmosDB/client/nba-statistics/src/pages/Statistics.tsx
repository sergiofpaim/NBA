import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Divider, Typography, List, ListItem, TextField } from '@mui/material';
import globalTheme from '../styles/global-theme';

const Statistics = () => {
  const [season, setSeason] = React.useState('');
  const [game, setGame] = React.useState('');
  const [player, setPlayer] = React.useState('');

  const handleSeasonChange = (event: SelectChangeEvent) => {
    setSeason(event.target.value as string);
  };

  const handleGameChange = (event: SelectChangeEvent) => {
    setGame(event.target.value as string);
  };

  const handlePlayerChange = (event: SelectChangeEvent) => {
    setPlayer(event.target.value as string);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        position: 'absolute',
        top: '50%',
        left: '5%',
        transform: 'translateY(-50%)',
        width: '90%',
      }}
    >
      <Box
        sx={{
          width: '20%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h1" gutterBottom sx={{ fontWeight: 'bold' }}>Pick a player</Typography>
        <FormControl fullWidth>
          <InputLabel id="season-label" sx={{ color: globalTheme.palette.primary.main }}>Season</InputLabel>
          <Select
            labelId="season-label"
            id="season-select"
            value={season}
            label="Season"
            onChange={handleSeasonChange}
          >
            <MenuItem value={10}>24-25</MenuItem>
            <MenuItem value={20}>23-24</MenuItem>
            <MenuItem value={30}>22-23</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="game-label" sx={{ color: globalTheme.palette.primary.main }}>Game</InputLabel>
          <Select
            labelId="game-label"
            id="game-select"
            value={game}
            label="Game"
            onChange={handleGameChange}
          >
            <MenuItem value={10}>LAL vs GSW</MenuItem>
            <MenuItem value={20}>GSW vs BOS</MenuItem>
            <MenuItem value={30}>BOS vs LAL</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="player-label" sx={{ color: globalTheme.palette.primary.main }}>Player</InputLabel>
          <Select
            labelId="player-label"
            id="player-select"
            value={player}
            label="Player"
            onChange={handlePlayerChange}
          >
            <MenuItem value={10}>Lebron James</MenuItem>
            <MenuItem value={20}>Jason Tatum</MenuItem>
            <MenuItem value={30}>Stephen Curry</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: '100%',
            height: 45,
            marginTop: 2,
            borderRadius: 4,
            backgroundColor: globalTheme.palette.primary.main,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: globalTheme.palette.primary.dark,
            },
          }}
        >
          Retrieve
        </Button>
      </Box>
      <Divider orientation="vertical" flexItem sx={{ marginLeft: 2, marginRight: 2, borderColor: globalTheme.palette.primary.main, borderWidth: 2 }} />
      <Box
        sx={{
          width: '75%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          paddingLeft: 4,
          gap: 2,
        }}
      >
        <Typography variant="h2" gutterBottom>
          Performance
        </Typography>
        <Box
          sx={{
            width: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h2" gutterBottom textAlign="center">
            In the season (40 games)
          </Typography>
        </Box>
        <Box
          sx={{
            width: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h2" gutterBottom textAlign="center">
            In the game
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Statistics;
