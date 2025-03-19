import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import LoginPage from "@/pages/LoginPage";
import {useAuth} from "@/app/providers/AuthContext";
import Header from "@/shared/ui/Header";

import AlertPage from "../pages/AlertPage";
import {SidePanel} from "@/shared/ui/SidePanel";
import styled from "styled-components";
import SettingsPage from "@/pages/SettingsPage";
import QrEventPage from "@/pages/qrEventPage";

export const routesConfig = [
    {path: "/login", element: <LoginPage/>, headerLabel: 'Авторизация', isPrivate: false},
    {path: "/", element: <AlertPage/>, headerLabel: 'Алерты.Общие', isPrivate: true},
    {path: "/alerts", element: <AlertPage/>, headerLabel: 'Алерты.Общие', isPrivate: true},
    {path: "/settings", element: <SettingsPage/>, headerLabel: 'Настройки.QR', isPrivate: true},
    {path: "/qr-event", element: <QrEventPage/>, headerLabel: 'Настройки.QR', isPrivate: false},

];

const PrivateRoute = ({children}: { children: React.ReactElement | null }) => {
    const {user} = useAuth();
    return user ? children : <Navigate to="/login"/>;
};

export const AppRoutes = () => {

// Обновленный ConditionalLayout
    const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({children}) => {
        const [panelCollapsed, setPanelCollapsed] = useState<boolean>(false)
        const location = useLocation();
        const hideHeaderAndFooter = location.pathname.startsWith('/login') || location.pathname.startsWith('/qr-event');

        return (
            <AppContainer>
                {/* Панель слева */}
                {!hideHeaderAndFooter && (
                    <SidePanel setPanelCollapsed={setPanelCollapsed}/>
                )}

                {/* Контент справа */}
                <ContentWrapper $collapsed={panelCollapsed}>
                    {!hideHeaderAndFooter && <Header/>}
                    <MainContent>{children}</MainContent>
                </ContentWrapper>
            </AppContainer>
        );
    };


    return (
        <Router>

            <ConditionalLayout>
                <Routes>
                    {routesConfig.map(({path, element, isPrivate}) => (
                        <Route
                            key={path}
                            path={path}
                            element={isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element}
                        />
                    ))}
                </Routes>
            </ConditionalLayout>
        </Router>
    );
};

// Стили для макета
const AppContainer = styled.div`
    display: flex;
    height: 100vh;
`;

const ContentWrapper = styled.div<{ $collapsed: boolean }>`
    display: flex;
    flex-direction: column;
    width: ${({$collapsed}) => ($collapsed ? 'calc(100vw - 80px)' : 'calc(100vw)')};
    transition: width 0.3s ease;
`;

const MainContent = styled.main`
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    background-color: #f5f5f5;
`;
