import {useInfiniteQuery, useQuery} from "react-query";
import {axiosInstance} from "@/processes/api/axiosConfig";

interface FetchImagesResponse {
    results: any[]; // Указываем тип для изображений, если он известен
    next: string | null; // URL для следующей страницы или null, если нет следующей страницы
}

interface FetchImagesByFormFactorParams {
    pageParam?: number;
    formFactorID: string | null;
    pageSize: number;
}

interface UseImagesByFormFactorResult {
    results: any[]; // Указываем тип для изображений
    next: string | null;
}

interface FetchImagesResponse {
    results: any[]; // Указываем тип для изображений (можно уточнить, если известен)
    next: string | null; // URL для следующей страницы или null
}

interface FetchImagesByWorktypeParams {
    pageParam?: number;
    worktypeId: string | null;
    pageSize: number;
}

// Типизация результата хука
interface UseImagesByWorktypeResult {
    results: any[]; // Указываем тип для изображений (можно уточнить)
    next: string | null;
}


const fetchImagesByFormFactor = async ({
                                           pageParam = 1,
                                           formFactorID,
                                           pageSize
                                       }: FetchImagesByFormFactorParams): Promise<FetchImagesResponse> => {
    if (!formFactorID) return {results: [], next: null}; // Проверка на null

    try {
        const response = await axiosInstance.get(`/api/v1/images/filter/formfactor/`, {
            params: {form_factor_id: formFactorID, page: pageParam, page_size: pageSize},
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке изображений', error);
        throw error;
    }
};


export const useImagesByFormFactor = (formFactorID: string | null, pageSize: number) => {
    return useInfiniteQuery<UseImagesByFormFactorResult>({
        queryKey: ['ImagesByFormFactorData', formFactorID],
        queryFn: ({pageParam = 1}) => fetchImagesByFormFactor({pageParam, formFactorID, pageSize}),
        enabled: !!formFactorID,
        getNextPageParam: (lastPage) => lastPage?.next ? new URL(lastPage.next).searchParams.get('page') : null,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        staleTime: 5000,
    });
};

// Функция для загрузки изображений по виду работ
const fetchImagesByWorktype = async ({
                                         pageParam = 1,
                                         worktypeId,
                                         pageSize
                                     }: FetchImagesByWorktypeParams): Promise<FetchImagesResponse> => {
    try {
        const response = await axiosInstance.get(`/api/v1/images/filter/worktype/`, {
            params: {worktype_id: worktypeId, page: pageParam, page_size: pageSize},
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке изображений', error);
        throw error;
    }
};


// Хук для загрузки изображений по виду работ
export const useImagesByWorktype = (worktypeID: string | null, pageSize: number) => {
    return useInfiniteQuery<UseImagesByWorktypeResult>({
        queryKey: ['ImagesByWorktypeData', worktypeID],
        queryFn: ({pageParam = 1}) => fetchImagesByWorktype({pageParam, worktypeId: worktypeID, pageSize}),
        enabled: !!worktypeID,
        getNextPageParam: (lastPage) => {
            return lastPage?.next ? new URL(lastPage.next).searchParams.get('page') : null;
        },
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        staleTime: 5000,
    });
};


// Хук для получения изображения по ID
export const useImageById = (imageId: string | undefined) => {
    return useQuery({
        queryKey: ['ImageById', imageId],
        queryFn: () => fetchImageById(imageId),
        enabled: !!imageId, // Запрос выполняется только если imageId передан
        refetchOnWindowFocus: false, // Не обновлять при фокусе на окно
    });
};

// Функция для получения изображения по ID
const fetchImageById = async (imageId: string | undefined) => {
    try {
        const response = await axiosInstance.get(`/api/v1/images/${imageId}/`); // Запрос по ID
        console.log("Изображение:", response.data);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке изображения", error);
        throw error;
    }
};





