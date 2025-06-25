import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

declare module '#app' {
    interface NuxtApp {
        $api: {
            get<T>(url: string): Promise<Response<T>>;
            post<T, U>(url: string, body: T): Promise<Response<U>>;
            put<T, U>(url: string, body: T): Promise<Response<U>>;
            del<T>(url: string): Promise<Response<T>>;
        };
    }
}

export interface Response<T> {
    code: number | null;
    message: string;
    payLoad: T;
    success: boolean;
}

export default defineNuxtPlugin(nuxtApp => {
    const baseHost = import.meta.browser ? window.location.hostname : 'localhost';
    const basePort = process.env.NUXT_ENV_API_PORT || 8080;

    const apiClient: AxiosInstance = axios.create({
        baseURL: `http://${baseHost}:${basePort}`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    async function get<T>(url: string): Promise<Response<T>> {
        try {
            const response: AxiosResponse<Response<T>> = await apiClient.get(url);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }

    async function post<T, U>(url: string, body: T): Promise<Response<U>> {
        try {
            const response: AxiosResponse<Response<U>> = await apiClient.post(url, body);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }

    async function put<T, U>(url: string, body: T): Promise<Response<U>> {
        try {
            const response: AxiosResponse<Response<U>> = await apiClient.put(url, body);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }

    async function del<T>(url: string): Promise<Response<T>> {
        try {
            const response: AxiosResponse<Response<T>> = await apiClient.delete(url);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }

    function handleResponse<T>(response: AxiosResponse<Response<T>>): Response<T> {
        if (response.status === 200) {
            return { ...response.data, success: true };
        } else {
            return {
                success: false,
                message: response.data.message || 'An error occurred.',
                code: response.data.code,
                payLoad: {} as T,
            };
        }
    }

    function handleError<T>(error: any): Response<T> {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message || error.message,
                code: null,
                payLoad: {} as T,
            };
        }
        return {
            success: false,
            message: 'An unknown error occurred.',
            code: null,
            payLoad: {} as T,
        };
    }

    nuxtApp.provide('api', {
        get,
        post,
        put,
        del
    });
});
