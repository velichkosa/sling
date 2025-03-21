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


export const useImagesByWorktype = (worktypeId: string) => {
    return useQuery({
        queryKey: ['ImagesByWorktypeData', worktypeId],
        queryFn: () => fetchImagesByWorktype(worktypeId),
        enabled: !!worktypeId, // Запрос выполняется только если worktypeId передан
        // staleTime: 10000, // Кеширование данных на 10 секунд
        refetchOnWindowFocus: false, // Не обновлять при фокусе на окно
    });
};

export const fetchImagesByWorktype = async (worktypeId: string) => {
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




