import React, {useState} from "react";
import {ClearIcon, Dropdown, DropdownItem, Input, SearchBox, SearchContainer, SearchIcon} from './searchBarStyles'
import {useNavigate} from "react-router-dom";


const suggestions = ["React", "TypeScript", "Styled Components", "Django", "AI", "OpenAI", "GraphQL"];
const SearchBar: React.FC<{ setQuery: (q: string) => void }> = ({setQuery}) => {
    const [localQuery, setLocalQuery] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [focused, setFocused] = useState(false);
    const navigate = useNavigate(); // Добавляем навигацию

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalQuery(value);
        setQuery(value);

        if (value.length > 0) {
            setFilteredSuggestions(
                suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
            );
            navigate("/search"); // Переход на поиск только если что-то введено
        } else {
            setFilteredSuggestions([]);
            navigate("/"); // Если поле пустое, возвращаемся на главную
        }
    };

    const handleClear = () => {
        setLocalQuery("");
        setQuery("");
        setFilteredSuggestions([]);
        navigate("/"); // Очищаем и возвращаемся на главную
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