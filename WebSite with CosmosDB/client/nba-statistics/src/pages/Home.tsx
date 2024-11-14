import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import globalTheme from '../styles/global-theme';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        overflow: 'hidden',
        padding: 0,
      }}
    >
      <Box
        display="flex"
        justifyContent={isMobile ? 'center' : 'space-between'} // Adjust for desktop and mobile
        alignItems="center"
        flexDirection={isMobile ? 'column' : 'row'}
        gap={isMobile ? 4 : 5}
        sx={{
          width: '100%',
          paddingX: isMobile ? 0 : 4,
        }}
      >
        {/* Statistics Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: 300,
            height: 250,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            borderRadius: 4,
            border: 6,
            borderColor: globalTheme.palette.secondary.main,
            textTransform: 'none',
            marginLeft: isMobile ? 0 : '0', // Remove margin on desktop
          }}
          onClick={() => navigate('/statistics')}
        >
          <Typography variant="h6" gutterBottom sx={{ color: globalTheme.palette.background.default, fontWeight: "bold" }}>
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
            width: 300,
            height: 250,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            borderRadius: 4,
            border: 6,
            borderColor: globalTheme.palette.secondary.main,
            textTransform: 'none',
            marginRight: isMobile ? 0 : '0', // Remove margin on desktop
          }}
          onClick={() => navigate('/record')}
        >
          <Typography variant="h6" gutterBottom sx={{ color: globalTheme.palette.background.default, fontWeight: "bold" }}>
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