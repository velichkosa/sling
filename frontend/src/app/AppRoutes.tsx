import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Footer from "@/shared/ui/Footer";

import CatalogPage from "../pages/CatalogPage";
import styled from "styled-components";
import SearchResultsPage from "@/pages/SearchPage";
import SchemaDetail from "@/pages/DetailPage";

export const AppRoutes = () => {
    const [query, setQuery] = useState("");
    const [breadcrumbState, setBreadcrumbState] = useState({
        selectedCategory: null,
        selectedGroup: null
    });

    return (
        <Router>
            <ConditionalLayout query={query} setQuery={setQuery}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            query
                                ? <SearchResultsPage query={query}/>
                                : <CatalogPage
                                    breadcrumbState={breadcrumbState}
                                    setBreadcrumbState={setBreadcrumbState}
                                />
                        }
                    />
                    <Route
                        path="/image/:id"
                        element={
                            query
                                ? <SearchResultsPage query={query}/>
                                : <SchemaDetail
                                    breadcrumbState={breadcrumbState}
                                    setBreadcrumbState={setBreadcrumbState}
                                />
                        }
                    />
                </Routes>
            </ConditionalLayout>
        </Router>
    );
};

// Обновленный ConditionalLayout, передаем query и setQuery
const ConditionalLayout: React.FC<{
    children: React.ReactNode,
    query: string,
    setQuery: (q: string) => void
}> = ({children, query, setQuery}) => {
    return (
        <AppContainer>
            <ContentWrapper>
                <MainContent>{children}</MainContent>
                <Footer setQuery={setQuery}/>
            </ContentWrapper>
        </AppContainer>
    );
};

// Стили для макета
const AppContainer = styled.div`
    display: flex;
    height: 100vh;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100vw;
    transition: width 0.3s ease;
    min-height: 100vh;
`;

const MainContent = styled.main`
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    background-color: #f5f5f5;
`;