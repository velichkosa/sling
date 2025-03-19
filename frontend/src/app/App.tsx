import {AppRoutes} from './AppRoutes';
import {QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';
import {queryClient} from "@/processes/api/queryClient";
import {AuthProvider} from "@/app/providers/AuthContext";
import {store} from "@/app/store/reduxStore";
import React from "react";

function App() {


    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <AppRoutes/>
                </AuthProvider>
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
