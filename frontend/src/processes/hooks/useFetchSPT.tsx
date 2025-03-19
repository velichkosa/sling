import {useQuery} from "react-query";
import {axiosInstance} from "@/processes/api/axiosConfig";
import {QueryFilters} from "@/processes/hooks/useFetchVWShiftSummary";

// export interface Type {
//     id: string;
//     name: string;
// }

// export interface Organization {
//     id: string;
//     name: string;
//     is_contractor: boolean;
// }
//
// export interface Status {
//     id: string;
//     name: string;
// }

// export interface HomeLocation {
//     id: string;
//     name: string;
//     description: string | null;
// }
//
// export interface ParameterDetails {
//     id: string;
//     name: string;
// }

// export interface Parameter {
//     id: string;
//     value: number;
//     parameters: ParameterDetails;
// }

// export interface Equipment {
//     id: string;
//     name: string;
//     parameters: Parameter[];
// }


export interface SPT {
    id: string;
    gos_num: string;
    type: string;
    type_full: string;
    org: string;
    status: string;
    equipment: string;
    is_active: boolean;
}


export const useSPTData = (props: QueryFilters) => {
    return useQuery<SPT[]>({
        queryKey: ['SPTData'],
        queryFn: () => fetchSPT(props),
        staleTime: 10000,
        refetchOnWindowFocus: false,
    });
};

const fetchSPT = async (props: QueryFilters): Promise<SPT[]> => {
    const response = await axiosInstance.get<SPT[]>('api/v1/vw-techs/', {
        params: {
            ordering: props.sortOrder === 'desc' ? `-${props.sortBy}` : props.sortBy,
            ...props.filters,
        },
    });
    return response.data;
};




