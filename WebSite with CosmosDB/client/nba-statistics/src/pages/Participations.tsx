import React from 'react';
import { useParams } from 'react-router-dom';

const Participations: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>(); // Extract gameId from the URL

  React.useEffect(() => {
    console.log('Game ID:', gameId);
  }, [gameId]);

  return (
    <div>
      <h1>Participations Page</h1>
      <p>Game ID: {gameId}</p>
    </div>
  );
};

export default Participations;
