import axios from "axios";

const axiosInstance = axios.create({
    timeout: 10000,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === "ECONNABORTED") {
            alert("Connection timed out");
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
