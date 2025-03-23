import {useInfiniteQuery, useQuery} from "react-query";
import {axiosInstance} from "@/processes/api/axiosConfig";

interface FetchImagesResponse {
    results: SlingScheme[];
    next: string | null;
    count: number;
    previous: string | null
}

interface FetchImagesByFormFactorParams {
    pageParam?: number;
    formFactorID: string | null;
    pageSize: number;
}


interface FetchImagesByWorktypeParams {
    pageParam?: number;
    worktypeId: string | null;
    pageSize: number;
}


export interface Sling {
    id: string;
    name: string;
    image: string;
    description: string;
}

interface WorkType {
    id: string;
    name: string;
    description: string;
}

interface FormFactor {
    id: string;
    name: string;
    description: string;
}


export interface SlingScheme {
    id: string;
    created_at: Date;
    updated_at: Date;
    title: string;
    image: string;
    description: string;
    approved_slings: Sling[];
    tags: string[];
    work_types: WorkType[];
    form_factors: FormFactor[]; // Можно уточнить тип, если известен
}


const fetchImagesByFormFactor = async ({
                                           pageParam = 1,
                                           formFactorID,
                                           pageSize
                                       }: FetchImagesByFormFactorParams): Promise<FetchImagesResponse> => {
    if (!formFactorID) return {count: 0, previous: null, results: [], next: null}; // Проверка на null

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
    return useInfiniteQuery<FetchImagesResponse>({
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
    return useInfiniteQuery<FetchImagesResponse>({
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
    return useQuery<SlingScheme>({
        queryKey: ['ImageById', imageId],
        queryFn: () => fetchImageById(imageId),
        enabled: !!imageId, // Запрос выполняется только если imageId передан
        refetchOnWindowFocus: false, // Не обновлять при фокусе на окно
    });
};

// Функция для получения изображения по ID
const fetchImageById = async (imageId: string | undefined): Promise<SlingScheme> => {
    if (!imageId) throw new Error("imageId is required");

    try {
        const response = await axiosInstance.get<SlingScheme>(`/api/v1/images/${imageId}/`);
        console.log("Изображение:", response.data);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке изображения", error);
        throw error;
    }
};





