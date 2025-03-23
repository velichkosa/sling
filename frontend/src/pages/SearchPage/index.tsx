import {axiosInstance} from "@/processes/api/axiosConfig";
import React, {useEffect, useState} from "react";
import ImageGallery from "@/shared/ui/ImageGallery";

export const SearchResultsPage: React.FC<{ query: string }> = ({query}) => {
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        if (!query || query.length < 3) {
            setResults([]); // Очищаем результаты, если запрос слишком короткий
            return;
        }

        const delaySearch = setTimeout(async () => {
            try {
                const response = await axiosInstance.get(`/api/v1/images/search/`, {
                    params: {q: query},
                });
                setResults(response.data.results);
                console.log("Результаты поиска:", response.data);
            } catch (error) {
                console.error("Ошибка при поиске:", error);
            }
        }, 500); // 500 мс задержка

        return () => clearTimeout(delaySearch); // Очищаем таймер при новом вводе
    }, [query]); // Запуск при изменении query

    return (
        <div>
            <h1>Результаты поиска по: "{query}"</h1>
            {results.length > 0 ?
                <ImageGallery imagesDataList={results} from="search"/> :
                (query.length < 3 ? "Введите минимум 3 символа для поиска" : "Нет результатов")
            }
        </div>
    );
};

export default SearchResultsPage;