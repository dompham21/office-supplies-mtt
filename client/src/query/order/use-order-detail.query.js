import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchOrderDetail = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.ORDER_DETAIL}/${id}`);
    const { data } = response;
    return {
       order: data?.data
     };
};





const useOrderDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.ORDER_DETAIL, id],
        () => fetchOrderDetail(id),
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { useOrderDetailQuery, fetchOrderDetail };

