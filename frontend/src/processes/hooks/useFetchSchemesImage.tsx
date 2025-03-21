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

export const useImagesByWorktype = (worktypeID: string | null) => {
    return useQuery({
        queryKey: ['ImagesByWorktypeData', worktypeID],
        queryFn: () => fetchImagesByWorktype(worktypeID),
        enabled: !!worktypeID, // Запрос выполняется только если worktypeId передан
        // staleTime: 10000, // Кеширование данных на 10 секунд
        refetchOnWindowFocus: false, // Не обновлять при фокусе на окно
    });
};

export const fetchImagesByWorktype = async (worktypeId: string | null) => {
    try {
        const response = await axiosInstance.get(`/api/v1/images/filter/worktype/`, {
            params: {worktype_id: worktypeId},
        });

        console.log("Изображения:", response.data);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке изображений", error);
        throw error;
    }
};





