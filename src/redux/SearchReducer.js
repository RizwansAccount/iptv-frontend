import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'SearchReducer',
    initialState: {
        search: "",
    },
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        removeSearch: (state) => {
            state.search = "";
        },
    },
});

export const { setSearch, removeSearch } = slice.actions;

export const searchSelector = (state) => state.SearchReducer.search;

export default slice.reducer;