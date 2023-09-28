import{ get } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchGetMaxPrice = async () => {    
    const response = await get(API_ENDPOINTS.PRODUCT_GET_MAX_PRICE);
    const { data } = response;
    return {
        price: data.data
     };
};



const useGetMaxPriceQuery = (  ) => {
    return useQuery(
        [API_ENDPOINTS.PRODUCT_GET_MAX_PRICE],
        () => fetchGetMaxPrice(),
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }
    );
};

export { useGetMaxPriceQuery, fetchGetMaxPrice };

