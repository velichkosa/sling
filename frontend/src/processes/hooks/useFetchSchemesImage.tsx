import {useInfiniteQuery, useQuery} from "react-query";
import {axiosInstance} from "@/processes/api/axiosConfig";


interface FormFactor {
    id: string
    name: string
}

interface WorkType {
    id: string
    name: string
}

export interface Category {
    formFactor: FormFactor[]
    workType: WorkType[]
}

// @ts-ignore
const fetchImagesByFormFactor = async ({pageParam = 1, formFactorID, pageSize}) => {
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
    return useInfiniteQuery({
        queryKey: ['ImagesByFormFactorData', formFactorID],
        queryFn: ({pageParam = 1}) => fetchImagesByFormFactor({pageParam, formFactorID, pageSize}),
        enabled: !!formFactorID,
        getNextPageParam: (lastPage) => lastPage?.next ? new URL(lastPage.next).searchParams.get('page') : null,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        staleTime: 5000,
    });
};

// @ts-ignore
const fetchImagesByWorktype = async ({pageParam = 1, worktypeId, pageSize}) => {
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

export const useImagesByWorktype = (worktypeID: string | null, pageSize: number) => {
    return useInfiniteQuery({
        queryKey: ['ImagesByWorktypeData', worktypeID],
        queryFn: ({pageParam}) => fetchImagesByWorktype({pageParam, worktypeId: worktypeID, pageSize}),
        enabled: !!worktypeID,
        getNextPageParam: (lastPage) => {
            return lastPage.next ? new URL(lastPage.next).searchParams.get('page') : null;
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





