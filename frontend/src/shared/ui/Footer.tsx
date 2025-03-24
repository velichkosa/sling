import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import SearchBar from "@/shared/ui/SearchBar";

const Footer: React.FC<{ setQuery: (q: string) => void }> = ({setQuery}) => {
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setViewportHeight(window.innerHeight);
            setKeyboardOpen(window.innerHeight < screen.height * 0.7);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <SearchPanelContainer>
            <SearchBar setQuery={setQuery}/>
        </SearchPanelContainer>
    );
};


export default Footer;

const SearchPanelContainer = styled.header`
    background: ${({theme}) => theme.searchPanel.background};
    color: ${({theme}) => theme.searchPanel.color};
    padding: 20px;
    text-align: center;
    width: 100%;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000; /* Чтобы футер был поверх остальных элементов */

    @media (max-width: 768px) {
        width: 100vw;
    }
`;



