import { getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchPurchaseOrder = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.PURCHASE_ORDERS_ADMIN}/${id}`);
    const { data } = response;
    return {
       purchaseOrder: data?.data
     };
};





const usePurchaseOrderDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.PURCHASE_ORDERS_ADMIN, id],
        () => fetchPurchaseOrder(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { usePurchaseOrderDetailQuery, fetchPurchaseOrder };

