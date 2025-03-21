import styled from "styled-components";
import {Search, X} from "lucide-react";

export const SearchContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 600px;
`;

export const SearchBox = styled.div<{ $focused: boolean, }>`
    display: flex;
    align-items: center;
    background: ${({theme}) => theme.searchBox.background};
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 24px;
    padding: 12px 16px;
    box-shadow: ${({$focused}) => ($focused ? "0 4px 10px rgba(255, 255, 255, 0.2)" : "none")};
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    cursor: text;
`;

export const Input = styled.input`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: ${({theme}) => theme.searchBox.input};
    font-size: 16px;
    padding: 0 8px;

    &::placeholder {
        color: ${({theme}) => theme.searchBox.placeholder};
    }
`;

export const SearchIcon = styled(Search)`
    color: ${({theme}) => theme.searchBox.searchIcon};
    width: 20px;
    height: 20px;
`;

export const ClearIcon = styled(X)`
    color: ${({theme}) => theme.searchBox.clearIcon};
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: rgba(255, 255, 255, 0.7);
    }
`;

export const Dropdown = styled.div`
    position: absolute;
    bottom: 48px; /* Смещаем вверх */
    width: 100%;
    background: ${({theme}) => theme.searchBox.dropdownBackground};
    border-radius: 12px;
    backdrop-filter: blur(10px);
    overflow: hidden;
    box-shadow: ${({theme}) => theme.searchBox.dropdownBoxShadow};
`;


export const DropdownItem = styled.div`
    padding: 12px 16px;
    color: ${({theme}) => theme.searchBox.dropdownItem};
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
