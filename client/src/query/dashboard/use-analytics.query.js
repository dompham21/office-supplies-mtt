import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchAnalytics = async () => {
    
    const response = await getAuthorization(API_ENDPOINTS.REPORT_ANLYTICS);
    const { data } = response;

    return {
        total_order: data?.total_order,
        total_revenue: data?.total_revenue,
        total_review: data?.total_review,
        total_user: data?.total_user,
     };
};



const useAnalyticsQuery = (  ) => {
    return useQuery(
        [API_ENDPOINTS.REPORT_ANLYTICS],
        () => fetchAnalytics(),

        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        
        }
    );
};

export { useAnalyticsQuery, fetchAnalytics };

