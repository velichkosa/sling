import {createSelector} from 'reselect';
import {RootState} from "@/app/store/reduxStore";

// текущий маршрут
const selectUrlState = (state: RootState) => state.url;

export const selectUrlPath = createSelector(
    selectUrlState,
    (url) => url.path
);
