export const Config = {
    apiUrl : 'http://localhost:3000/',
    userToken : 'user-token',
    imgUrl : 'http://localhost:3000/public/',

    fnGetPaginationUrl: function(apiEndPoint, params) {
        let url = `${apiEndPoint}?`;
        if (params?.search) { url += `search=${params.search}&`}
        if (params?.page) { url += `page=${params.page}&`}
        if (params?.limit) { url += `limit=${params.limit}`}
        return { url };
    }
}