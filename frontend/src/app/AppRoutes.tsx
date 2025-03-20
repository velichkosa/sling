import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Footer from "@/shared/ui/Footer";

import SearchPage from "@/pages/SearchPage";
import styled from "styled-components";


export const routesConfig = [
    {path: "/", element: <SearchPage/>, headerLabel: 'Поиск схем строповкаи', isPrivate: false},
    // {path: "/settings", element: <SettingsPage/>, headerLabel: 'Настройки.QR', isPrivate: true},
    // {path: "/qr-event", element: <QrEventPage/>, headerLabel: 'Настройки.QR', isPrivate: false},

];

export const AppRoutes = () => {

// Обновленный ConditionalLayout
    const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({children}) => {
        const [panelCollapsed, setPanelCollapsed] = useState<boolean>(false)
        const location = useLocation();
        const hideHeaderAndFooter = location.pathname.startsWith('/login') || location.pathname.startsWith('/qr-event');

        return (
            <AppContainer>
                <ContentWrapper $collapsed={panelCollapsed}>
                    <MainContent>{children}</MainContent>
                    {!hideHeaderAndFooter && <Footer/>}
                </ContentWrapper>
            </AppContainer>
        );
    };


    return (
        <Router>

            <ConditionalLayout>
                <Routes>
                    {routesConfig.map(({path, element}) => (
                        <Route
                            key={path}
                            path={path}
                            element={element}
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
    min-height: 100vh;
`;

const MainContent = styled.main`
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    background-color: #f5f5f5;
`;