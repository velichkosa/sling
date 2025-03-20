import {ThemeProvider} from "styled-components";
import {themes} from "@/shared/style/Colors";
import {AppRoutes} from './AppRoutes';
import {QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';
import {queryClient} from "@/processes/api/queryClient";
import {store} from "@/app/store/reduxStore";
import React, {useState} from "react";

type ThemeName = keyof typeof themes;

function App() {
    const [theme, setTheme] = useState<ThemeName>("dark");


    return (
        <Provider store={store}>
            <ThemeProvider theme={themes[theme]}>
                <QueryClientProvider client={queryClient}>
                    <AppRoutes/>
                </QueryClientProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
