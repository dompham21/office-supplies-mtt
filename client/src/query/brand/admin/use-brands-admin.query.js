import { getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchBrands = async ({ queryKey }) => {
    const [_key, params] = queryKey;
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params

    
    const response = await getAuthorization(API_ENDPOINTS.BRANDS_ADMIN, params);
    const { data } = response;

    return {
        brands: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};





const useBrandsQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.BRANDS_ADMIN, params],
        fetchBrands,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { useBrandsQuery, fetchBrands };

