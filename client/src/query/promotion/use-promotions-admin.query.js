import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchPromotions = async ({ queryKey }) => {
    const [_key, params] = queryKey;
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params

    
    const response = await getAuthorization(API_ENDPOINTS.PROMOTIONS_ADMIN, params);
    const { data } = response;

    return {
        promotions: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};





const usePromotionsQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.PROMOTIONS_ADMIN, params],
        fetchPromotions,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { usePromotionsQuery, fetchPromotions };

