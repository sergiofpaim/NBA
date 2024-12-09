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
import Tracking from './pages/Tracking';

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
  '/record/gameId/:gameId/participations': [
    { title: 'Home', route: '/' },
    { title: 'Record', route: '/record' },
    { title: 'Participations', route: '/record/gameId/:gameId/participations' },
  ],
  '/record/gameId/:gameId/participations/playerId/:participationId/tracking': [
    { title: 'Home', route: '/' },
    { title: 'Record', route: '/record' },
    { title: 'Participations', route: '/record/gameId/:gameId/participations' },
    { title: 'Tracking', route: '/record/gameId/:gameId/participations/playerId/:participationId/tracking' },
  ],
};

const generateDynamicBreadcrumbs = (pathname: string) => {
  if (pathname.startsWith('/record/gameId/') && pathname.includes('/participations/playerId/') && pathname.includes('/tracking')) {
    const [, , , gameId, , playerId, , participationId] = pathname.split('/');
    return [
      { title: 'Home', route: '/' },
      { title: 'Record', route: '/record' },
      { title: 'Participations', route: `/record/gameId/${gameId}/participations` },
      { title: 'Tracking', route: `/record/gameId/${gameId}/participations/playerId/${playerId}/tracking` },
    ];
  }

  if (pathname.startsWith('/record/gameId/')) {
    const gameId = pathname.split('/')[3]; // Extracting gameId from the URL
    return breadcrumbsMap['/record/gameId/:gameId/participations'].map(breadcrumb => ({
      ...breadcrumb,
      route: breadcrumb.route.replace(':gameId', gameId), // Replacing the dynamic part with the actual gameId
    }));
  }

  return breadcrumbsMap[pathname as keyof typeof breadcrumbsMap] || breadcrumbsMap['/'];
};

const BreadcrumbsController: React.FC = () => {
  const location = useLocation();
  const breadcrumb = generateDynamicBreadcrumbs(location.pathname);

  return (
    <GlobalLayout breadcrumb={breadcrumb}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/record" element={<Record />} />
        <Route path="/record/gameId/:gameId/participations" element={<Participations />} />
        <Route path="/record/gameId/:gameId/participations/playerId/:participationId/tracking" element={<Tracking />} />
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