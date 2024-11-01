import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddPlay from '../src/components/commands/AddPlay';
import AddGame from '../src/components/commands/AddGame';
import ListPlay from '../src/components/commands/ListPlay';
import Reseed from '../src/components/commands/Reseed';

const App: React.FC = () => {
    return (
        <div>
            <h1>NBA API</h1>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="add-play-content" id="add-play-header">
                    <Typography>Add Play</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    Add the player&apos;s plays to the game
                    <AddPlay />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="add-game-content" id="add-game-header">
                    <Typography>Add Game</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <AddGame />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="list-play-content" id="list-play-header">
                    <Typography>List Play</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ListPlay />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="reseed-content" id="reseed-header">
                    <Typography>Reseed</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Reseed />
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default App;
