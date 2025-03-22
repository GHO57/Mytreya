import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.API_GATEWAY_URL, // api-gateway url
    timeout: 5000,
});

export default axiosInstance;
