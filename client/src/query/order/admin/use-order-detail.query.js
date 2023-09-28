import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchOrder = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.ORDERS_ADMIN}/${id}`);
    const { data } = response;
    return {
       order: data?.data
     };
};





const useOrderDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.ORDERS_ADMIN, id],
        () => fetchOrder(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { useOrderDetailQuery, fetchOrder };

