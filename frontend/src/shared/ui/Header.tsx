import React from 'react';
import styled from 'styled-components';
import {useAuth} from "@/app/providers/AuthContext";
import {useLocation, Link} from "react-router-dom";
import {routesConfig} from "@/app/AppRoutes";

const Header: React.FC = () => {
    const {logout} = useAuth();
    const location = useLocation();

    // Находим headerLabel по текущему маршруту
    const currentRoute = routesConfig.find(route => route.path === location.pathname);
    const headerLabel = currentRoute ? currentRoute.headerLabel : 'Неизвестная страница';


    return (
        <HeaderContainer>
            <Nav>
                <NavItem to="/" $active={true}>
                    {headerLabel}
                </NavItem>
            </Nav>
            <LogOut onClick={logout}>Выйти</LogOut>
        </HeaderContainer>
    );
};

export default Header;

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #007bff;
    color: white;
    height: 96px;
    width: 100%;

    @media (max-width: 768px) {
        width: 100vw;
    }
`;

const Logo = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
`;

const Nav = styled.nav`
    display: flex;
    gap: 2rem;
    justify-content: left;
    flex: 1;
`;

const NavItem = styled(Link)<{ $active: boolean }>`
    text-decoration: none;
    color: ${({$active}) => ($active ? 'rgb(255,255,255)' : 'white')};
    font-weight: ${({$active}) => ($active ? 'bold' : 'normal')};

    &:hover {
        text-decoration: underline;
    }
`;


const LogOut = styled.div`
    margin-left: 2.5rem;
    cursor: pointer;
    color: #ffcc00;

    &:hover {
        text-decoration: underline;
    }
`;
