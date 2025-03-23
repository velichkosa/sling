import {useQuery} from "react-query";
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

export const useImagesByFormFactor = (formFactorID: string | null) => {
    return useQuery({
        queryKey: ['ImagesByFormFactorData', formFactorID],
        queryFn: () => fetchImagesByFormFactor(formFactorID),
        enabled: !!formFactorID, // Запрос выполняется только если formFactorID передан
        // staleTime: 10000, // Кеширование данных на 10 секунд
        refetchOnWindowFocus: false, // Не обновлять при фокусе на окно
    });
};

export const fetchImagesByFormFactor = async (formFactorID: string | null) => {
    try {
        const response = await axiosInstance.get(`/api/v1/images/filter/formfactor/`, {
            params: {form_factor_id: formFactorID},
        });

        console.log("Изображения:", response.data);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке изображений", error);
        throw error;
    }
};

export const useImagesByWorktype = (worktypeID: string | null, page: number, pageSize: number) => {
    return useQuery(
        ['ImagesByWorktypeData', worktypeID, page], // Use page as part of the query key
        () => fetchImagesByWorktype(worktypeID, page, pageSize),
        {
            enabled: !!worktypeID, // Only run the query if worktypeID exists
            refetchOnWindowFocus: false,
            keepPreviousData: true, // Keep previous data while loading new page
            staleTime: 5000, // Optionally, you can adjust stale time
        }
    );
};

const fetchImagesByWorktype = async (worktypeId: string | null, page: number, pageSize: number) => {
    try {
        const response = await axiosInstance.get(`/api/v1/images/filter/worktype/`, {
            params: {worktype_id: worktypeId, page: page, page_size: pageSize},
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке изображений', error);
        throw error;
    }
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





