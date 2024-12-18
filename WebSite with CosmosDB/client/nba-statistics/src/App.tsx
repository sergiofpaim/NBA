import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import store from './stores/Store';
import globalTheme from './styles/GlobalTheme';
import BreadcrumbsController from './components/BreadcrumbsController';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={globalTheme}>
        <Router>
          <BreadcrumbsController />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;