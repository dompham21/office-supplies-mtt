import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchProducts = async ({ queryKey }) => {
    const [_key, params] = queryKey;
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params

    
    const response = await getAuthorization(API_ENDPOINTS.PRODUCTS_SELLER, params);
    const { data } = response;

    return {
        products: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};





const useProductsSellerQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.PRODUCTS_SELLER, params],
        fetchProducts,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false,

        }
    );
};

export { useProductsSellerQuery, fetchProducts };

