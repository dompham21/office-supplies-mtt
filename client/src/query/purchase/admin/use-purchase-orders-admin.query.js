import { getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchPurchaseOrders = async ({ queryKey }) => {
    const [_key, params] = queryKey;
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params

    
    const response = await getAuthorization(API_ENDPOINTS.PURCHASE_ORDERS_ADMIN, params);
    const { data } = response;

    return {
        purchaseOrders: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};





const usePurchaseOrdersQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.PURCHASE_ORDERS_ADMIN, params],
        fetchPurchaseOrders,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { usePurchaseOrdersQuery, fetchPurchaseOrders };

