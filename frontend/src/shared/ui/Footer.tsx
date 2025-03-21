import React from 'react';
import styled from 'styled-components';
import SearchBar from "@/shared/ui/SearchBar";

const Footer: React.FC<{ setQuery: (q: string) => void }> = ({setQuery}) => {
    return (
        <FooterContainer>
            <SearchBar setQuery={setQuery}/>
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


