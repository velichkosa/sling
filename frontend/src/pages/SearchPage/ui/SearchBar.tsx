import {useState} from "react";
import {ClearIcon, Dropdown, DropdownItem, Input, SearchBox, SearchContainer, SearchIcon} from './searchBarStyles'
import {axiosInstance} from "@/processes/api/axiosConfig";
import {useImagesByWorktype} from "@/processes/hooks/useFetchSchemesImage";

const suggestions = ["React", "TypeScript", "Styled Components", "Django", "AI", "OpenAI", "GraphQL"];

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [focused, setFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            setFilteredSuggestions(
                suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
            );
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleClear = () => {
        setQuery("");
        setFilteredSuggestions([]);
    };

    const handleSearch = async () => {
        if (!query.trim()) return;

        try {
            const response = await axiosInstance.get(`/api/v1/images/search/`, {
                params: {q: query}
            });
            console.log("Результаты поиска:", response.data);
        } catch (error) {
            console.error("Ошибка при поиске:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
            handleClear();
        }
    };

    return (
        <SearchContainer>
            <SearchBox $focused={focused}>
                <SearchIcon/>
                <Input
                    type="text"
                    placeholder="Что искать?"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 200)} // Задержка для клика по списку
                />
                {query && <ClearIcon onClick={handleClear}/>}
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
