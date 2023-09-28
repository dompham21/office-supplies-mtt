import{ get } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchProducts = async (params) => {

    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params
    
    const response = await get(API_ENDPOINTS.PRODUCTS, params);
    const { data } = response;

    return {
        products: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum,
        
     };
};



const useProductsQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.PRODUCTS, params],
        () => fetchProducts(params),
        
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        
        }
    );
};

export { useProductsQuery, fetchProducts };

