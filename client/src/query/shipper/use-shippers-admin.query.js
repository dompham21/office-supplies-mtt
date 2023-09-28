import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchShippers = async ({ queryKey }) => {
    let [_key, params] = queryKey;
    const {
        keyword
        } = params

    const response = await getAuthorization(API_ENDPOINTS.SHIPPERS, params);
    const { data } = response;

    return {
        shippers: data.data
     };
};





const useShippersQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.SHIPPERS, params],
        fetchShippers,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { useShippersQuery, fetchShippers };

