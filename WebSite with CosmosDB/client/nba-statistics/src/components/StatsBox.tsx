import React from 'react';
import { Box, Typography } from '@mui/material';
import globalTheme from '../styles/GlobalTheme';

// Define the StatBox component
interface StatBoxProps {
  label: string;
  value: string | number;
  labelText: string;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, labelText }) => {
  return (
    <Box
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
        {value}:
      </Typography>
      <Typography
        sx={{
          fontSize: 20,
          color: globalTheme.palette.primary.main,
          fontWeight: 'bold',
        }}
      >
        {labelText}
      </Typography>
    </Box>
  );
};

export default StatBox;
