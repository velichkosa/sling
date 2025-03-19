import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useForm, SubmitHandler} from 'react-hook-form';
import styled from 'styled-components';
import {useAuth} from '@/app/providers/AuthContext';
import {loginUser} from '@/pages/LoginPage/model/loginService';
import {useDispatch} from "react-redux";
import {setUrlPath} from "@/app/store/urlSlice";
import {getValidAccessToken} from "@/processes/api/helpers";
import {title} from "@/shared/ui/title";


interface LoginFormInputs {
    username: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<LoginFormInputs>();
    const [loginError, setLoginError] = useState<string | null>(null);
    const {login, tokens} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()

    useEffect(() => {
        document.title = title.login;
    }, []);

    useEffect(() => {
        const checkToken = async () => {
            // Проверка токена при загрузке страницы
            try {
                const validAccessToken = await getValidAccessToken();
                if (validAccessToken) {
                    navigate('/alerts'); // Перенаправляем, если токен действителен
                }
            } catch (error) {
                console.warn('Ошибка при проверке токена');
                // Обработка ошибки, например, перенаправление на страницу логина
            }
        };

        checkToken();
        dispatch(setUrlPath(location.pathname));
    }, [navigate, dispatch]);

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            const {user, access, refresh} = await loginUser(data);

            login(user, {accessToken: access, refreshToken: refresh});

            navigate('/alerts'); // Если нужно перенаправление после логина
        } catch (error) {
            setLoginError('Неправильное имя пользователя или пароль');
        }
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <InputWrapper>
                    <Label>Имя пользователя</Label>
                    <Input
                        {...register('username', {required: 'Введите имя пользователя'})}
                        type="text"
                        placeholder="Введите имя пользователя"
                    />
                    {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                </InputWrapper>

                <InputWrapper>
                    <Label>Пароль</Label>
                    <Input
                        {...register('password', {required: 'Введите пароль'})}
                        type="password"
                        placeholder="Введите пароль"
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </InputWrapper>

                {loginError && <ErrorMessage>{loginError}</ErrorMessage>}

                <Button type="submit">Войти</Button>
            </Form>
        </Container>
    );
};

export default LoginPage;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f4;
`;

const Form = styled.form`
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h1`
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 1.5rem;
    color: #333;
`;

const InputWrapper = styled.div`
    margin-bottom: 1rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #555;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 0.8rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

const ErrorMessage = styled.p`
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #d9534f;
`;
