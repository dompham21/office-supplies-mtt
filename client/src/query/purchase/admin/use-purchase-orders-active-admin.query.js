import { getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchPurchaseOrders = async () => {
   

    
    const response = await getAuthorization(API_ENDPOINTS.PURCHASE_ORDERS_ACTIVE_ADMIN);
    const { data } = response;

    return {
        purchaseOrders: data.data,
       
     };
};





const usePurchaseOrdersActiveQuery = (  ) => {
    return useQuery(
        [API_ENDPOINTS.PURCHASE_ORDERS_ACTIVE_ADMIN],
        fetchPurchaseOrders,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { usePurchaseOrdersActiveQuery, fetchPurchaseOrders };

