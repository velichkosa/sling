import React from 'react';
import styled from 'styled-components';
import {useLocation, Link} from "react-router-dom";
import {routesConfig} from "@/app/AppRoutes";
import SearchBar from "@/pages/SearchPage/ui/SearchBar";

const Footer: React.FC = () => {
    const location = useLocation();

    // Находим headerLabel по текущему маршруту
    const currentRoute = routesConfig.find(route => route.path === location.pathname);
    const footerLabel = currentRoute ? currentRoute.headerLabel : 'Неизвестная страница';


    return (
        <FooterContainer>
            <SearchBar/>
        </FooterContainer>
    );
};

export default Footer;

const FooterContainer = styled.footer`
    background: ${({theme}) => theme.footer.background};
    color: ${({theme}) => theme.footer.color};
    padding: 20px;
    text-align: center;
    width: 100%;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;


    @media (max-width: 768px) {
        width: 100vw;
    }
`;


