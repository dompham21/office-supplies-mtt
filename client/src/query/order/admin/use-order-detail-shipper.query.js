import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchOrder = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.ORDERS_SHIPPER}/${id}`);
    const { data } = response;
    return {
       order: data?.data
     };
};





const useOrderDetailShipperQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.ORDERS_SHIPPER, id],
        () => fetchOrder(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { useOrderDetailShipperQuery, fetchOrder };

