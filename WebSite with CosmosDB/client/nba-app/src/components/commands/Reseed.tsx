import React from 'react';
import { reseed } from '../../services/api';
import axios from 'axios';

const Reseed: React.FC = () => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await reseed();
            alert('Reseed completed successfully!');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(`Error reseeding: ${error.response?.data || error.message}`);
            } else {
                alert('Error reseeding: ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
        }
    };

    return (
        <button onClick={handleSubmit}>Reseed</button>
    );
};

export default Reseed;
