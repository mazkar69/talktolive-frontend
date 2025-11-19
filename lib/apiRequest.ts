'use client'

import axios from "axios";
import useSWR from "swr";


const backendURL = process.env.NEXT_PUBLIC_BACKEND_URI;

console.log("API Request - Backend URL:", backendURL);  

const api = axios.create({
    baseURL: backendURL,
});
export default api;


export const authApi = axios.create({
    baseURL: backendURL,
});


export const authMultiFormApi = axios.create({
    baseURL: backendURL,
});


authApi.interceptors.request.use(config => {
    config.headers['authorization'] = `Bearer ${localStorage.getItem("web-token")}`
    return config
}, error => {
    return Promise.reject(error)
})

authMultiFormApi.interceptors.request.use(config => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem("web-token")}`
    config.headers["content-type"] = "multipart/form-data"
    return config
}, error => {
    return Promise.reject(error)
})


// ----------------------------------------------------------------


export const fetcher = async (url: string) => {
    const { data } = await api.get(url);
    return data;
}

export const authFetcher = async (url: string) => {
    const { data } = await authApi.get(url);
    return data;
}


export function useApi(url: string) {
    const { data, error, isLoading } = useSWR(url, fetcher)
    return {
        data,
        isLoading,
        isError: error
    }
}

export function useAuthApi(url: string) {
    const { data, error, isLoading } = useSWR(url, authFetcher)
    return {
        data,   
        isLoading,
        isError: error
    }
}

// -----------------------------------------------------------

