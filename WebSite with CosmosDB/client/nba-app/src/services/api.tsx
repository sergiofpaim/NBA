import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:5000/nba';

export const addPlay = async (playData: { playerId: string; gameId: string; quarter: number; playType: number }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add/play`, playData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Axios error:', error);
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            throw new Error(`Error: ${axiosError.response.status} - ${axiosError.response.data}`);
        } else if (axiosError.request) {
            throw new Error(`Error: No response received. Request: ${axiosError.request}`);
        } else {
            throw new Error(`Error: ${axiosError.message}`);
        }
    }
};
