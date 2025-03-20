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
    const responseFormFactor = await axiosInstance.get<FormFactor[]>('api/v1/form-factor/');
    const responseWorkType = await axiosInstance.get<WorkType[]>('api/v1/work-type/');

    return {
        formFactor: responseFormFactor.data,
        workType: responseWorkType.data
    }
};





