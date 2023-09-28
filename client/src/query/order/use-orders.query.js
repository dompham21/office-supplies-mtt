import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchOrders = async (id, params) => {
    const {
        pageNo,
        pageSize, fromDate, toDate 
    } = params

    if(fromDate == null || toDate == null || fromDate == ''  || toDate == '') {
        const { fromDate, ...removeFromDateObj } = params;
        const { toDate, ...removeToDateObj } = removeFromDateObj;
        params = removeToDateObj
    } 

   
    
    const response = await getAuthorization(`${API_ENDPOINTS.GET_ORDERS}/${id}`, params);
    const { data } = response;

    return {
        orders: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNo
     };
};

const useOrdersQuery = ( id, params ) => {
    return useQuery(
        [API_ENDPOINTS.GET_ORDERS, id, params],
        () => fetchOrders(id, params),
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { useOrdersQuery, fetchOrders };

