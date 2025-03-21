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


export const useCategory = () => {
    return useQuery<Category>({
        queryKey: 'CategoryData',
        queryFn: () => fetchCategory(),
        // staleTime: 10000,
        // refetchOnWindowFocus: false,
    });
};

const fetchCategory = async (): Promise<Category> => {
    try {
        console.log("Запрос отправлен");
        const responseFormFactor = await axiosInstance.get<FormFactor[]>('api/v1/form-factor/');
        console.log("Получен formFactor", responseFormFactor.data);
        const responseWorkType = await axiosInstance.get<WorkType[]>('api/v1/work-type/');
        console.log("Получен workType", responseWorkType.data);

        return {
            formFactor: responseFormFactor.data,
            workType: responseWorkType.data
        };
    } catch (error) {
        console.error("Ошибка при загрузке категорий", error);
        throw error;
    }
};





