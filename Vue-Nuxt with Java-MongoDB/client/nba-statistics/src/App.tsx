import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import store from './stores/Store';
import globalTheme from './styles/GlobalTheme';
import Breadcrumbs from './components/Breadcrumb';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={globalTheme}>
        <Router>
          <Breadcrumbs />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;