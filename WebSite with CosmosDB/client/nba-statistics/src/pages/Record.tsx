import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography, useMediaQuery, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button as MuiButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import globalTheme from '../styles/GlobalTheme';
import { AppDispatch, RootState } from '../stores/Store';
import { fetchGames, setCurrentGame } from '../stores/Transaction';
import List from '../components/ItemsList';
import { Game } from '../models/Game';
import Button from '../components/Button';

const Record: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const games = useSelector((state: RootState) => state.games.games);
  const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));

  const [openDialog, setOpenDialog] = useState(false);
  const [gameDetails, setGameDetails] = useState({
    homeTeamId: '',
    visitorTeamId: '',
    at: '',
  });

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  const renderGame = (game: any) => {
    return (
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
            {game.homeTeamId} vs {game.visitorTeamId}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
            {new Date(game.at).toLocaleDateString()}
          </Typography>
        </Box>
      </>
    );
  };

  const handleCreateGame = (): void => {
    setOpenDialog(true);
  };

  const handleGameClick = (game: Game) => {
    dispatch(setCurrentGame(game));
    console.log(`Current game set to:`, game);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    console.log('Creating game with details:', gameDetails);
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

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
        <Typography gutterBottom sx={{ ...globalTheme.typography.h1 }}>Last Games</Typography>
      </Box>

      <Divider
        orientation={isMobile ? 'vertical' : 'horizontal'}
        flexItem
        sx={{
          marginLeft: isMobile ? 0 : 2,
          marginRight: isMobile ? 0 : 2,
          borderColor: globalTheme.palette.primary.main,
          borderWidth: 2,
          marginTop: isMobile ? 4 : 0
        }}
      />

      <Box
        sx={{
          width: isMobile ? '100%' : '75%',
          height: '650px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          paddingLeft: isMobile ? 0 : 4,
          gap: 2,
          marginTop: 0,
          overflowY: 'auto',
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
          <Button text="Create Game" onClick={handleCreateGame} />
        </Box>
        <List
          items={games}
          handleItemClick={(game: Game) => handleGameClick(game)}
          renderItem={renderGame}
          label1="Home vs Visitor"
          label2="At"
        />
      </Box>

      {/* Dialog for creating a game */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle sx={{ color: 'black' }}>Create Game</DialogTitle>
        <DialogContent>
          <TextField
            label="Home Team"
            fullWidth
            margin="normal"
            name="homeTeamId"
            value={gameDetails.homeTeamId}
            onChange={handleInputChange}
          />
          <TextField
            label="Visitor Team"
            fullWidth
            margin="normal"
            name="visitorTeamId"
            value={gameDetails.visitorTeamId}
            onChange={handleInputChange}
          />
          <TextField
            label="Date"
            fullWidth
            margin="normal"
            name="at"
            value={gameDetails.at}
            onChange={handleInputChange}
            type="datetime-local"
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleDialogClose} color="secondary">Cancel</MuiButton>
          <MuiButton onClick={handleSubmit} color="primary">Create</MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Record;
