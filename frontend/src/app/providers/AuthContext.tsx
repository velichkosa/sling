import {createContext, useContext, useState, ReactNode, useEffect} from 'react';

type Org = {
    id: string;
    name: string;
};

type Position = {
    id: string;
    name: string;
};

type Tokens = {
    accessToken: string;
    refreshToken: string;
};

export interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
    role: string[] | null;
    org: Org;
    position: Position;
}

interface AuthContextProps {
    user: User | null;
    tokens: Tokens | null;
    isLoading: boolean;
    login: (user: User, tokens: Tokens) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<Tokens | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Сохраняем токены в localStorage и загружаем данные пользователя
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedTokens = localStorage.getItem('tokens');

        if (storedUser && storedTokens) {
            setUser(JSON.parse(storedUser));
            setTokens(JSON.parse(storedTokens));
        }

        setIsLoading(false);
    }, []);

    const login = (user: User, tokens: Tokens) => {
        setUser(user);
        setTokens(tokens);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('tokens', JSON.stringify(tokens));
    };

    const logout = () => {
        setUser(null);
        setTokens(null);
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
    };

    return (
        <AuthContext.Provider value={{user, tokens, isLoading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
