import{ get } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchProducts = async (pageParam, params) => {

    const {
        pageSize,
        sortField,
        sortDirection,
        } = params
    
    params = {...params, pageNo: pageParam}

    
    const response = await get(API_ENDPOINTS.PRODUCTS, params);
    const { data } = response;

    return {
        products: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum,
        
     };
};





const useProductsInfiniteQuery = ( params ) => {
    return useInfiniteQuery(
        [API_ENDPOINTS.PRODUCTS, params],
        ({pageParam = 1}) => fetchProducts(pageParam, params), 
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false, 
            getNextPageParam: (lastPage, pages) => {
                const totalPage = lastPage?.totalPage
                const pageNo = lastPage?.pageNo

                if(pageNo < totalPage) {
                    return pageNo + 1;
                }

                else return undefined
            }
        }
    );
};

export { useProductsInfiniteQuery, fetchProducts };

