import {useQuery} from "react-query";
import {axiosInstance} from "@/processes/api/axiosConfig";

export interface ShiftSummary {
    id: number;
    start_time: string;
    finish_time: string;
    shift_duration_seconds: number;
    tech_gos_number: string;
    tech_type: string;
    tech_status: string;
    org: string;
    event_id: string;
    event_name: string;
    event_start_time: string;
    event_finish_time: string;
    event_confirmation: boolean;
    event_duration_seconds: number;
    equipment_details: string;
}

export interface QueryFilters {
    sortBy: string,
    sortOrder: string,
    filters: { [key: string]: string }
}

export const useFetchVWShiftSummary = (props: QueryFilters) => {
    return useQuery<ShiftSummary[]>({
        queryKey: ['shiftSummary'],
        queryFn: () => fetchVWShiftSummary(props),
        staleTime: 10000,
        refetchOnWindowFocus: false,
    });
};

const fetchVWShiftSummary = async (props: QueryFilters): Promise<ShiftSummary[]> => {
    const response = await axiosInstance.get<ShiftSummary[]>('api/v1/vw_shift_summary/', {
        params: {
            ordering: props.sortOrder === 'desc' ? `-${props.sortBy}` : props.sortBy,
            ...props.filters,
        },
    });
    return response.data;
};




