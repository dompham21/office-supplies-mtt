import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchAnalytics = async () => {
    
    const response = await getAuthorization(API_ENDPOINTS.REPORT_SOLD_BY_CATEGORY);
    const { data } = response;

    return {
        data: data?.data,
        label: data?.label,
     };
};



const useSoldByCategoryQuery = (  ) => {
    return useQuery(
        [API_ENDPOINTS.REPORT_SOLD_BY_CATEGORY],
        () => fetchAnalytics(),
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        
        }
    );
};

export { useSoldByCategoryQuery, fetchAnalytics };

