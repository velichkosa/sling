import {axiosInstance} from "@/processes/api/axiosConfig";

// подтвердить событие
export const confirmEvent = async (eventID: string) => {
    return await axiosInstance.put(`api/v1/shift_events/qr/confirm/`, null, {
        params: {event_id: eventID},
    });

}