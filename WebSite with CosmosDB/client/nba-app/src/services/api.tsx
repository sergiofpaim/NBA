import axios, { AxiosError } from 'axios';
import { AddGameParm, AddPlayParm, ListPlayParms } from '../types';

const API_BASE_URL = 'http://localhost:5000/nba';

export const addPlay = async (playData: AddPlayParm) => {
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

export const addGame = async (gameData: AddGameParm) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add/game`, gameData, {
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

export const listPlay = async (parms: ListPlayParms) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get/participation`, { params: parms });
        console.log('API Response:', response.data);

        return response.data?.payLoad?.plays || [];
    } catch (error) {
        console.error('Error fetching plays:', error);
        throw error;
    }
};

export const reseed = async () => {
    try {
        const response = await axios.put(`${API_BASE_URL}/reseed`, {
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
