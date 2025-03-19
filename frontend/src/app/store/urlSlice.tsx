import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UrlState {
    path?: string;
}

const initialState: UrlState = {
    path: undefined,
};

const urlSlice = createSlice({
    name: 'url',
    initialState,
    reducers: {
        setUrlPath: (state, action: PayloadAction<any>) => {
            state.path = action.payload;
        },
    },
});

export const {
    setUrlPath,
} = urlSlice.actions;

export default urlSlice.reducer;
