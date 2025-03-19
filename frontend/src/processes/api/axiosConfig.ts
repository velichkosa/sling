import {config} from "@/app/config";
import {getValidAccessToken} from "@/processes/api/helpers";
import axios, {AxiosResponse} from "axios";

const axiosLogger = (config: any) => {
    if ((config as AxiosResponse).data) {
        console.log("Ответ:", config);
    } else {
        console.log("Запрос:", config);
    }
    return config;
};


export const axiosInstance = axios.create({
    baseURL: config.apiUrl,
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Объединение интерцепторов
axiosInstance.interceptors.request.use(
    async (config) => {
        // Получаем токен
        const accessToken = await getValidAccessToken();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        // Логирование запроса
        axiosLogger(config);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(axiosLogger, (error) => Promise.reject(error));