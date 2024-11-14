import { createTheme } from '@mui/material/styles';

const globalTheme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#DA1A32',
    },
    background: {
      default: '#00438C',
    },
    text: {
      primary: '#ffffff',
      secondary: '#00438C',
    },
  },
  typography: {
    fontFamily: '"Geomanist", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500
    },
    body1: {
      fontSize: '1rem'
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #ddd',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fafafa',
            borderWidth: 'medium'
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          padding: '8px'
        },
        icon: {
          color: '#ffffff',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          padding: '10px',
          borderRadius: '5px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#00438C',
          '&.Mui-selected': {
            backgroundColor: 'lightgrey'
          },
          '&:hover': {
            backgroundColor: '#f2f2f2',
          },
        },
      },
    },
  }
});

export default globalTheme;