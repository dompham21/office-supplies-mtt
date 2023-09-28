import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchPosters = async ({ queryKey }) => {
    const [_key, params] = queryKey;
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params

    
    const response = await getAuthorization(API_ENDPOINTS.POSTERS_ADMIN, params);
    const { data } = response;

    return {
        posters: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};





const usePostersQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.POSTERS_ADMIN, params],
        fetchPosters,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { usePostersQuery, fetchPosters };

