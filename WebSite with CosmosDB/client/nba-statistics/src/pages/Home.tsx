import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Box, Typography } from '@mui/material';
import globalTheme from '../styles/global-theme';

const HomePage = () => {

  const navigate = useNavigate();

  return (
    <Container>
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh" 
      flexDirection="row"
      gap={2}
    >
      {/* Statistics Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          width: 200,
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          borderRadius: 4,
          border: 6,
          borderColor: globalTheme.palette.secondary.main,
          textTransform: 'none'
        }}
        onClick={() => navigate('/statistics')}
      >
        <Typography variant="h6" gutterBottom sx={{color: globalTheme.palette.background.default, fontWeight: "bold"}}>
          Statistics
        </Typography>
        <Typography variant="body2" align="center">
        Access game and player statistics from the database
        </Typography>
      </Button>

      {/* Record Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          width: 200,
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          borderRadius: 4,
          border: 6,
          borderColor: globalTheme.palette.secondary.main,
          textTransform: 'none'
        }}
        onClick={() => navigate('/record')}
      >
        <Typography variant="h6" gutterBottom sx={{color: globalTheme.palette.background.default, fontWeight: "bold"}}>
        Record
        </Typography>
        <Typography variant="body2" align="center">
        Add, delete, and edit data from the database
        </Typography>
      </Button>
    </Box>
    </Container>
  );
};

export default HomePage;