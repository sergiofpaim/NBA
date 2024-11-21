import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Divider, IconButton, Typography, useMediaQuery } from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import RefreshIcon from '@mui/icons-material/Refresh';
import globalTheme from '../styles/GlobalTheme';

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

  const isMobile = useMediaQuery('(max-width: 600px)');

  const stats = [
    { label: 'PPG', value: '23.1' },
    { label: 'APG', value: '7.8' },
    { label: 'RPG', value: '10.5' },
    { label: 'BPG', value: '1.2' },
    { label: 'FT%', value: '88.3' },
    { label: 'Total Points', value: '435' },
  ];

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
            display: 'flex', // Enables flexbox
            justifyContent: 'space-between', // Places the text on the left and the icon on the right
            alignItems: 'center',
            gap: 1
          }}>
            <IconButton aria-label="delete" sx={{
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