import {axiosInstance} from "@/processes/api/axiosConfig";
import React from "react";
import ImageGallery from "@/shared/ui/ImageGallery";
import {useInfiniteQuery} from "react-query";
import {useInView} from "react-intersection-observer";

const fetchSearchResults = async ({pageParam = 1, query}: { pageParam?: number; query: string }) => {
    const response = await axiosInstance.get(`/api/v1/images/search/`, {
        params: {q: query, page: pageParam, page_size: 10}, // Пагинация
    });
    return response.data;
};

export const SearchResultsPage: React.FC<{ query: string }> = ({query}) => {
    const {ref, inView} = useInView();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["searchResults", query],
        queryFn: ({pageParam}) => fetchSearchResults({pageParam, query}),
        enabled: query.length >= 3,
        getNextPageParam: (lastPage, pages) => (lastPage.results.length ? pages.length + 1 : undefined), // Определяем, есть ли ещё страницы
    });

    React.useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage]);

    const imagesDataList = data?.pages.flatMap((page) => page.results) || [];

    return (
        <div>
            <h1>Результаты поиска по: "{query}"</h1>

            {isLoading && <p>Загрузка...</p>}
            {isError && <p>Ошибка при поиске. Попробуйте позже.</p>}

            {imagesDataList.length > 0 ? (
                <ImageGallery
                    imagesDataList={imagesDataList}
                    from="search"
                    refObserver={ref} // Передаём ref для подгрузки
                    isFetchingNextPage={isFetchingNextPage}
                />
            ) : (
                <p>{query.length < 3 ? "Введите минимум 3 символа для поиска" : "Нет результатов"}</p>
            )}
        </div>
    );
};


export default SearchResultsPage;