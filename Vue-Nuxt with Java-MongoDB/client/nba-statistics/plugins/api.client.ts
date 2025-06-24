// plugins/api.client.ts
import { defineNuxtPlugin } from '#app'
import axios from 'axios'
import type { AxiosResponse } from 'axios';


export interface Response<T> {
    code: number | null
    message: string
    payLoad: T
    success: boolean
}

class Api {
    private static instance: Api
    private apiClient

    private constructor() {
        const host = window.location.hostname
        const port = 8080

        this.apiClient = axios.create({
            baseURL: `http://${host}:${port}`,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    public static getInstance(): Api {
        if (!Api.instance) {
            Api.instance = new Api()
        }
        return Api.instance
    }

    public async get<T>(url: string): Promise<Response<T>> {
        try {
            const response: AxiosResponse<Response<T>> = await this.apiClient.get(url)
            return this.handleResponse(response)
        } catch (err: any) {
            return this.handleError(err)
        }
    }

    public async post<T, U>(url: string, body: T): Promise<Response<U>> {
        try {
            const response: AxiosResponse<Response<U>> = await this.apiClient.post(url, body)
            return this.handleResponse(response)
        } catch (err: any) {
            return this.handleError(err)
        }
    }

    public async put<T, U>(url: string, body: T): Promise<Response<U>> {
        try {
            const response: AxiosResponse<Response<U>> = await this.apiClient.put(url, body)
            return this.handleResponse(response)
        } catch (err: any) {
            return this.handleError(err)
        }
    }

    public async delete<T>(url: string): Promise<Response<T>> {
        try {
            const response: AxiosResponse<Response<T>> = await this.apiClient.delete(url)
            return this.handleResponse(response)
        } catch (err: any) {
            return this.handleError(err)
        }
    }

    private handleResponse<T>(response: AxiosResponse<Response<T>>): Response<T> {
        if (response.status === 200) {
            return { ...response.data, success: true }
        }
        return {
            success: false,
            message: response.data.message || 'An error occurred during the request.',
            code: response.data.code,
            payLoad: {} as T,
        }
    }

    private handleError<T>(error: any): Response<T> {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message || error.message,
                code: null,
                payLoad: {} as T,
            }
        }
        return {
            success: false,
            message: 'An unknown error occurred.',
            code: null,
            payLoad: {} as T,
        }
    }
}

export default defineNuxtPlugin(() => {
    const api = Api.getInstance()
    return {
        provide: {
            api,
        }
    }
})