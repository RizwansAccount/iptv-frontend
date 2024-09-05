import { useState } from "react";

export function usePaginationManger () {

    const defaultLimit = 5;
    const [pagination, setPagination] = useState({ page: 1, limit: defaultLimit });

    const defaultCurrent = pagination.page;
    const pageSize = pagination.limit;
    const pageSizeOptions = ['5', '10', '15'];

    const fnOnChangePagination = (page, pageSize) => setPagination({ page, limit: pageSize });

    return {
        pagination,
        defaultCurrent,
        pageSize,
        pageSizeOptions,

        setPagination,
        fnOnChangePagination
    }
}