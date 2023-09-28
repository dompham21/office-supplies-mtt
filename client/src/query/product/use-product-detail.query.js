import{ get } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchProduct = async (id) => {
console.log(id)

    
    const response = await get(`${API_ENDPOINTS.PRODUCT_DETAIL}/${id}`);
    const { data } = response;
    return {
       product: data?.data
     };
};





const useProductDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.PRODUCT_DETAIL, id],
        () => fetchProduct(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { useProductDetailQuery, fetchProduct };

