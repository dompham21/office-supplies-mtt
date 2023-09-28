import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchAnalytics = async (params) => {
    
    const response = await getAuthorization(API_ENDPOINTS.REPORT_ORDER_OVERVIEW, params);
    const { data } = response;

    return {
        data: data?.data,
        label: data?.label,
     };
};



const useOrderOverview = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.REPORT_ORDER_OVERVIEW, params],
        () => fetchAnalytics(params),

        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        
        }
    );
};

export { useOrderOverview, fetchAnalytics };

