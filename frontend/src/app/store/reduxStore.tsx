import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

// Пример slice
import userSlice from '@/app/store/userSlice';
import urlSlice from "@/app/store/urlSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        url: urlSlice
    },
});

// Типизация
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Хуки для использования в компонентах
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
