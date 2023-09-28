import{ get } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchProducts = async () => {    
    const response = await get(API_ENDPOINTS.PRODUCTS_PROMOTION);
    const { data } = response;
    console.log(data)
    return {
        products: data.data
     };
};



const useProductPromotionQuery = (  ) => {
    return useQuery(
        [API_ENDPOINTS.PRODUCTS_PROMOTION],
        () => fetchProducts(),
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }
    );
};

export { useProductPromotionQuery, fetchProducts };

