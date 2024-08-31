// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Config } from '../constants'
import { getLocalStorage } from '../localStorage';

const TAG_TYPES = { genre: 'genre', series: 'series', season: 'season', episode: 'episode' };

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
    tagTypes: [TAG_TYPES.genre, TAG_TYPES.episode, TAG_TYPES.season, TAG_TYPES.series],
    endpoints: (builder) => ({
        
        registerUser: builder.mutation({ query: (data) => ({ url: 'users/registration', method: 'POST', body: data, }) }),
        loginUser: builder.mutation({ query: (data) => ({ url: 'users/login', method: 'POST', body: data, }) }),
        verifyUser: builder.mutation({ query: (data) => ({ url: 'users/verify-code', method: 'POST', body: data }) }),
        resendCode: builder.mutation({ query: (data) => ({ url: 'users/resend-code', method: 'POST', body: data }) }),

        getAllGenre: builder.query({ query: () => ({ url: 'genres' }), providesTags: () => [TAG_TYPES.genre], transformResponse: (res) => res?.data }),

        addGenre : builder.mutation({ query: (data) => ({ url: 'genres', method: 'POST', body: data }), invalidatesTags: [TAG_TYPES.genre] }),
        deleteGenre: builder.mutation({ query: (id) => ({ url: `genres/${id}`, method: 'DELETE' }), invalidatesTags: [TAG_TYPES.genre] }),
        updateGenre: builder.mutation({
            query: (data) => {
                const { _id, ...bodyData } = data;
                return { url: `genres/${_id}`, method: 'PATCH', body: bodyData }
            },
            invalidatesTags: [TAG_TYPES.genre]
        }),

    }),
})

export const { useRegisterUserMutation, useLoginUserMutation, useVerifyUserMutation, useResendCodeMutation,
    useGetAllGenreQuery, useDeleteGenreMutation, useUpdateGenreMutation, useAddGenreMutation
} = iptvApi;