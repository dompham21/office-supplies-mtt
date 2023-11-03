import { getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchReceipt = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.RECEIPTS_ADMIN}/${id}`);
    const { data } = response;
    return {
       receipt: data?.data
     };
};





const useReceiptDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.RECEIPTS_ADMIN, id],
        () => fetchReceipt(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { useReceiptDetailQuery, fetchReceipt };

