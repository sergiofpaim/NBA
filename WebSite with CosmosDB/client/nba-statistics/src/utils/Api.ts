import axios, { AxiosResponse } from 'axios';

export interface Response<T> {
    code: number | null;
    message: string;
    payLoad: T;
    success: boolean | false;
}

class Api {
    private static instance: Api;
    private apiClient;

    // Making the constructor private to prevent direct instantiation
    private constructor() {
        const baseHost = window.location.hostname;
        const basePort = 5000;

        this.apiClient = axios.create({
            baseURL: `http://${baseHost}:${basePort}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Singleton pattern: ensures only one instance of the Api class
    public static getInstance(): Api {
        if (!Api.instance) {
            Api.instance = new Api();
        }
        return Api.instance;
    }

    // Generic GET request
    public async get<T>(url: string): Promise<Response<T>> {
        try {
            const response: AxiosResponse<Response<T>> = await this.apiClient.get(url);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Generic POST request
    public async post<T, U>(url: string, body: T): Promise<Response<U>> {
        try {
            const response: AxiosResponse<Response<U>> = await this.apiClient.post(url, body);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Generic PUT request
    public async put<T, U>(url: string, body: T): Promise<Response<U>> {
        try {
            const response: AxiosResponse<Response<U>> = await this.apiClient.put(url, body);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Generic DELETE request
    public async delete<T>(url: string): Promise<Response<T>> {
        try {
            const response: AxiosResponse<Response<T>> = await this.apiClient.delete(url);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Handle successful response
    private handleResponse<T>(response: AxiosResponse<Response<T>>): Response<T> {
        if (response.status === 200) {
            return { ...response.data, success: true };
        } else {
            return { success: false, message: response.data.message || 'An error occurred during the request.', code: response.data.code, payLoad: {} as T };
        }
    }

    // Handle error from axios
    private handleError<T>(error: any): Response<T> {
        if (axios.isAxiosError(error)) {
            return { success: false, message: error.response?.data.Message || error.message, code: null, payLoad: {} as T };
        }
        return { success: false, message: 'An unknown error occurred.', code: null, payLoad: {} as T };
    }
}

// Exporting a single instance of the API class
export const api = Api.getInstance();
