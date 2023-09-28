import { getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchBrand = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.BRANDS_ADMIN}/${id}`);
    const { data } = response;
    return {
       brand: data?.data
     };
};





const useBrandDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.BRANDS_ADMIN, id],
        () => fetchBrand(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { useBrandDetailQuery, fetchBrand };

