import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchOrders = async ({ queryKey }) => {
    let [_key, params] = queryKey;
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        statusIds,
        keyword
        } = params

    if(statusIds != null && statusIds?.length >0) {
        params = {...params, statusIds: statusIds.join(',')}
    }

    const response = await getAuthorization(API_ENDPOINTS.ORDERS_ADMIN, params);
    const { data } = response;

    return {
        orders: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNo
     };
};





const useOrdersQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.ORDERS_ADMIN, params],
        fetchOrders,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { useOrdersQuery, fetchOrders };

