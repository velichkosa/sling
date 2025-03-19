import {jwtDecode} from "jwt-decode";
import {config} from "@/app/config";
import axios from "axios";

// проверка срока годности токена
const isTokenExpired = (token: string) => {
    try {
        const decoded: any = jwtDecode(token);
        return Date.now() > decoded.exp * 1000;
    } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
        return true;
    }
};

// получение токена из local storage
export const getToken = () => {
    const storedTokens = localStorage.getItem('tokens')
    if (!storedTokens) {
        throw new Error('Нет токенов. Пожалуйста, выполните повторную авторизацию.');
    }
    return JSON.parse(storedTokens)
};

// валидация ACCESS токена
export const getValidAccessToken = async () => {
    const tokens = getToken();
    return !isTokenExpired(tokens.accessToken) ? tokens.accessToken : await refreshToken();
};

// обновление токена
const refreshToken = async () => {
    const tokens = getToken();

    const response = await axios.post(`${config.apiUrl}/auth/refresh/`, {
        access: tokens.accessToken,
        refresh: tokens.refreshToken,
    });
    const {access} = response.data;

    localStorage.setItem('ACCESS_TOKEN', access);

    return access;
};