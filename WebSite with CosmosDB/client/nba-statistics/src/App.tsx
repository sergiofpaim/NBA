import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Statistics from './pages/Statistics';
import Record from './pages/Record';
import Participations from './pages/Participations';
import GlobalLayout from './styles/GlobalLayout';
import globalTheme from './styles/GlobalTheme';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import store from './stores/Store';

const breadcrumbsMap = {
  '/': [{ title: 'Home', route: '/' }],
  '/statistics': [
    { title: 'Home', route: '/' },
    { title: 'Statistics', route: '/statistics' },
  ],
  '/record': [
    { title: 'Home', route: '/' },
    { title: 'Record', route: '/record' },
  ],
  '/record/participations/:gameId': [
    { title: 'Home', route: '/' },
    { title: 'Record', route: '/record' },
    { title: 'Participations', route: '/record/participations' },
  ],
};

const BreadcrumbsController: React.FC = () => {
  const location = useLocation();
  let breadcrumb = breadcrumbsMap[location.pathname as keyof typeof breadcrumbsMap];

  if (location.pathname.startsWith('/record/participations/')) {
    breadcrumb = breadcrumbsMap['/record/participations/:gameId'];
  } else {
    breadcrumb = breadcrumbsMap[location.pathname as keyof typeof breadcrumbsMap] || breadcrumbsMap['/'];
  }

  return (
    <GlobalLayout breadcrumb={breadcrumb}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/record" element={<Record />} />
        <Route path="/record/participations/:gameId" element={<Participations />} />
      </Routes>
    </GlobalLayout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={globalTheme}>
        <Router>
          <BreadcrumbsController />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;