// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Config } from '../constants'
import { getLocalStorage } from '../localStorage';

const TAG_TYPES = { genre: 'genre', series: 'series', season: 'season', episode: 'episode', file : 'file' };

export const iptvApi = createApi({
    reducerPath: 'pokemonApi',
    baseQuery: fetchBaseQuery({

        baseUrl: Config.apiUrl,
        prepareHeaders: async (headers, { getState, endpoint }) => {
            const storedToken = getLocalStorage(Config.userToken);
            if (storedToken && endpoint !== 'refresh') headers.set('Authorization', `Bearer ${storedToken}`);
            return headers;
        },
    }),
    tagTypes: [TAG_TYPES.genre, TAG_TYPES.episode, TAG_TYPES.season, TAG_TYPES.series, TAG_TYPES.file],
    endpoints: (builder) => ({
        
        // auth Apis
        registerUser: builder.mutation({ query: (data) => ({ url: 'users/registration', method: 'POST', body: data, }) }),
        loginUser: builder.mutation({ query: (data) => ({ url: 'users/login', method: 'POST', body: data, }) }),
        verifyUser: builder.mutation({ query: (data) => ({ url: 'users/verify-code', method: 'POST', body: data }) }),
        resendCode: builder.mutation({ query: (data) => ({ url: 'users/resend-code', method: 'POST', body: data }) }),

        // genre Apis
        getAllGenre: builder.query({ query: (search) => ({ url: search ? `genres?search=${search}` : 'genres' }), providesTags: () => [TAG_TYPES.genre], transformResponse: (res) => res?.data }),
        addGenre : builder.mutation({ query: (data) => ({ url: 'genres', method: 'POST', body: data }), invalidatesTags: [TAG_TYPES.genre] }),
        deleteGenre: builder.mutation({ query: (id) => ({ url: `genres/${id}`, method: 'DELETE' }), invalidatesTags: [TAG_TYPES.genre] }),
        updateGenre: builder.mutation({
            query: (data) => {
                const { _id, ...bodyData } = data;
                return { url: `genres/${_id}`, method: 'PATCH', body: bodyData }
            },
            invalidatesTags: [TAG_TYPES.genre]
        }),

        //series Apis
        getAllSeries: builder.query({ query: (search) => ({ url : search ? `series?search=${search}` : 'series' }), providesTags: ()=> [TAG_TYPES.series], transformResponse: (res) => res?.data }),
        addSeries: builder.mutation({ query: (data) => ({ url: 'series', method: 'POST', body: data }), invalidatesTags: [TAG_TYPES.series] }),
        deleteSeries: builder.mutation({ query: (id) => ({ url: `series/${id}`, method: 'DELETE' }), invalidatesTags: [TAG_TYPES.series] }),
        updateSeries: builder.mutation({
            query: (data) => {
                const { _id, ...bodyData } = data;
                return { url: `series/${_id}`, method: 'PATCH', body: bodyData }
            },
            invalidatesTags: [TAG_TYPES.series]
        }),

        //file apis
        getAllFiles: builder.query({ query: () => ({ url : 'file' }), transformResponse: (res) => res?.data }),
        uploadFile: builder.mutation({ query: (data) => ({ url: 'file', method: 'POST', body : data }), invalidatesTags: [TAG_TYPES.file], transformResponse:(res)=> res?.data }),
        getFile: builder.query({ query: (id) => ({ url : `file/${id}`}), providesTags: ()=> [TAG_TYPES.file], transformResponse: (res) => res?.data }),

        //season apis
        getAllSeasons: builder.query({ query:(search)=> ({ url: search ? `seasons?search=${search}` : 'seasons' }), providesTags:()=> [TAG_TYPES.season], transformResponse: (res) => res?.data }),
        addSeason: builder.mutation({ query: (data) => ({ url: 'seasons', method: 'POST', body: data }), invalidatesTags: [TAG_TYPES.season] }),
        deleteSeason: builder.mutation({ query: (id) => ({ url: `seasons/${id}`, method: 'DELETE' }), invalidatesTags: [TAG_TYPES.season] }),
        updateSeason: builder.mutation({
            query: (data) => {
                const { _id, ...bodyData } = data;
                return { url: `seasons/${_id}`, method: 'PATCH', body: bodyData }
            },
            invalidatesTags: [TAG_TYPES.season]
        }),

    }),
})

export const { 
    useRegisterUserMutation, useLoginUserMutation, useVerifyUserMutation, useResendCodeMutation,
    useGetAllGenreQuery, useDeleteGenreMutation, useUpdateGenreMutation, useAddGenreMutation,
    useGetAllSeriesQuery, useDeleteSeriesMutation, useUpdateSeriesMutation, useAddSeriesMutation,
    useGetAllFilesQuery, useUploadFileMutation, useGetFileQuery,
    useGetAllSeasonsQuery, useAddSeasonMutation, useUpdateSeasonMutation, useDeleteSeasonMutation
} = iptvApi;