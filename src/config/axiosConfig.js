import axios from "axios";
import { config } from "./apiConfig";

const authAxios = axios.create({
    baseURL: config.baseUrl,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

export default authAxios;