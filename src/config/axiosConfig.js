import axios from "axios";
import { config } from "./apiConfig";

const authAxios = axios.create({
    baseURL: config.baseUrl,
});

authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

export default authAxios;