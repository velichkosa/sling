import {User} from "@/app/providers/AuthContext";
import axios from "axios";
import {config} from "@/app/config";


interface LoginFormInputs {
    username: string;
    password: string;
}

interface AuthResponse {
    access: string;
    refresh: string;
    user: User
}

export const loginUser = async (data: LoginFormInputs): Promise<AuthResponse> => {
    const response = await axios.post(`${config.apiUrl}/api/v1/auth/login/`, {
        username: data.username,
        password: data.password,
    });

    const {tokens, user} = response.data;

    return {
        access: tokens.access,
        refresh: tokens.refresh,
        user,
    };
};
