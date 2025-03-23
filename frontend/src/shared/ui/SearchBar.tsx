import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {Search, X} from "lucide-react";


const suggestions = ["React", "TypeScript", "Styled Components", "Django", "AI", "OpenAI", "GraphQL"];
const SearchBar: React.FC<{ setQuery: (q: string) => void }> = ({setQuery}) => {
    const [localQuery, setLocalQuery] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [focused, setFocused] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Запоминаем путь каталога, если он не является поиском
        if (!location.pathname.startsWith("/search")) {
            localStorage.setItem("prevCatalogPath", location.pathname);
        }
    }, [location.pathname]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalQuery(value);
        setQuery(value);

        if (value.length > 0) {
            setFilteredSuggestions(
                suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
            );
            navigate("/search");
        } else {
            setFilteredSuggestions([]);
            navigate(localStorage.getItem("prevCatalogPath") || "/");
        }
    };

    const handleClear = () => {
        setLocalQuery("");
        setQuery("");
        setFilteredSuggestions([]);
        navigate(localStorage.getItem("prevCatalogPath") || "/");
    };

    return (
        <SearchContainer>
            <SearchBox $focused={focused}>
                <SearchIcon/>
                <Input
                    type="text"
                    placeholder="Что искать?"
                    value={localQuery}
                    onChange={handleChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 200)}
                />
                {localQuery && <ClearIcon onClick={handleClear}/>}
            </SearchBox>

            {focused && filteredSuggestions.length > 0 && (
                <Dropdown>
                    {filteredSuggestions.map((item, index) => (
                        <DropdownItem key={index} onClick={() => setQuery(item)}>
                            {item}
                        </DropdownItem>
                    ))}
                </Dropdown>
            )}
        </SearchContainer>
    );
};

export default SearchBar;

const SearchContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 600px;
`;

const SearchBox = styled.div<{ $focused: boolean, }>`
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

const Input = styled.input`
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

const SearchIcon = styled(Search)`
    color: ${({theme}) => theme.searchBox.searchIcon};
    width: 20px;
    height: 20px;
`;

const ClearIcon = styled(X)`
    color: ${({theme}) => theme.searchBox.clearIcon};
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: rgba(255, 255, 255, 0.7);
    }
`;

const Dropdown = styled.div`
    position: absolute;
    bottom: 48px; /* Смещаем вверх */
    width: 100%;
    background: ${({theme}) => theme.searchBox.dropdownBackground};
    border-radius: 12px;
    backdrop-filter: blur(10px);
    overflow: hidden;
    box-shadow: ${({theme}) => theme.searchBox.dropdownBoxShadow};
`;


const DropdownItem = styled.div`
    padding: 12px 16px;
    color: ${({theme}) => theme.searchBox.dropdownItem};
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
