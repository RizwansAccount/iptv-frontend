import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'SnackBarReducer',
    initialState: {
        message: null,
        error : false,
    },
    reducers: {
        setSnackBarMessage: (state, action) => {
            state.message = action.payload;
        },
        hideSnackBarMessage: (state) => {
            state.message = null;
        },
        setErrorMessage: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const { setSnackBarMessage, hideSnackBarMessage, setErrorMessage } = slice.actions;

export const snackBarMessageSelector = (state) => state.SnackBarReducer.message;
export const snackBarErrorSelector = (state) => state.SnackBarReducer.error;

export default slice.reducer;