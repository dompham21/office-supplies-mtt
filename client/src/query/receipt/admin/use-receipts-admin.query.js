import { getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchReceipts = async ({ queryKey }) => {
    const [_key, params] = queryKey;
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params

    
    const response = await getAuthorization(API_ENDPOINTS.RECEIPTS_ADMIN, params);
    const { data } = response;

    return {
        receipts: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};





const useReceiptsQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.RECEIPTS_ADMIN, params],
        fetchReceipts,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { useReceiptsQuery, fetchReceipts };

