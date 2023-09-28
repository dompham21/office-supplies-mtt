import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchCategories = async ({ queryKey }) => {
    const [_key, params] = queryKey;
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params

    
    const response = await getAuthorization(API_ENDPOINTS.CATEGORIES_ADMIN, params);
    const { data } = response;

    return {
        categories: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};





const useCategoriesQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.CATEGORIES_ADMIN, params],
        fetchCategories,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { useCategoriesQuery, fetchCategories };

