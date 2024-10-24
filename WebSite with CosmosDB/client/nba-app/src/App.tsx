import React from 'react';
import AddPlay from './components/commands/AddPlay';
import AddGame from './components/commands/AddGame';
import ListPlay from './components/commands/ListPlay';
import Reseed from './components/commands/Reseed';

const App: React.FC = () => {
  return (
    <div>
      <h1>NBA API</h1>
      <AddPlay />

      <AddGame />

      <ListPlay />

      <Reseed />
    </div>
  );
};

export default App;
