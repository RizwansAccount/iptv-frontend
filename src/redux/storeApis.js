// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Config } from '../constants'
import { getLocalStorage } from '../localStorage';

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
    endpoints: (builder) => ({
        registerUser: builder.mutation({ query: (data) => ({ url: 'users/registration', method: 'POST', body: data, }) }),
        loginUser: builder.mutation({ query: (data) => ({ url: 'users/login', method: 'POST', body: data, }) }),
        verifyUser: builder.mutation({ query: (data) => ({ url: 'users/resend-code', method: 'POST', body: data }) }),
    }),
})

export const { useRegisterUserMutation, useLoginUserMutation, useVerifyUserMutation,  } = iptvApi;