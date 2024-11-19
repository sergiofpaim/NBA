import axios, { AxiosResponse } from 'axios';

export interface Response<T> {
    Code: number | null;
    Message: string | null;
    PayLoad: T | null;
    Success: boolean | false;
}

class Api {
    private static instance: Api;
    private apiClient;

    private constructor() {
        this.apiClient = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public static getInstance(): Api {
        if (!Api.instance) {
            Api.instance = new Api();
        }
        return Api.instance;
    }

    async get<T>(url: string, params?: Record<string, any>): Promise<Response<T>> {
        try {
            const response: AxiosResponse<Response<T>> = await this.apiClient.get(url, { params });
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async post<T, U>(url: string, body: T): Promise<Response<U>> {
        try {
            const response: AxiosResponse<Response<U>> = await this.apiClient.post(url, body);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async put<T, U>(url: string, body: T): Promise<Response<U>> {
        try {
            const response: AxiosResponse<Response<U>> = await this.apiClient.put(url, body);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async delete<T>(url: string): Promise<Response<T>> {
        try {
            const response: AxiosResponse<Response<T>> = await this.apiClient.delete(url);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    private handleResponse<T>(response: AxiosResponse<Response<T>>): Response<T> {
        if (response.data.Code === 200) {
            return { ...response.data, Success: true };
        } else {
            return { Success: false, Message: response.data.Message || 'An error occurred during the request.', Code: response.data.Code, PayLoad: null };
        }
    }

    private handleError<T>(error: any): Response<T> {
        if (axios.isAxiosError(error)) {
            return { Success: false, Message: error.response?.data.Message || error.message, Code: null, PayLoad: null };
        }
        return { Success: false, Message: 'An unknown error occurred.', Code: null, PayLoad: null };
    }
}

export const api = Api.getInstance();