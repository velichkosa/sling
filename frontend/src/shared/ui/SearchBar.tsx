import React, {useEffect, useState} from "react";
import {ClearIcon, Dropdown, DropdownItem, Input, SearchBox, SearchContainer, SearchIcon} from './searchBarStyles'
import {useLocation, useNavigate} from "react-router-dom";


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