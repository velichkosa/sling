import {useState} from "react";
import {ClearIcon, Dropdown, DropdownItem, Input, SearchBox, SearchContainer, SearchIcon} from './searchBarStyles'


const suggestions = ["React", "TypeScript", "Styled Components", "Django", "AI", "OpenAI", "GraphQL"];

const SearchBar: React.FC<{ setQuery: (q: string) => void }> = ({ setQuery }) => {
    const [localQuery, setLocalQuery] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [focused, setFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalQuery(value);
        setQuery(value); // Обновляем глобальное состояние query

        if (value.length > 0) {
            setFilteredSuggestions(
                suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
            );
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleClear = () => {
        setLocalQuery("");
        setQuery(""); // Очищаем глобальное состояние
        setFilteredSuggestions([]);
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            // handleSearch();
            // handleClear();
        }
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
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 200)} // Задержка для клика по списку
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
