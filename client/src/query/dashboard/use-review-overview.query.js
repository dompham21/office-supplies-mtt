import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchAnalytics = async (params) => {
    
    const response = await getAuthorization(API_ENDPOINTS.REPORT_REVIEW_OVERVIEW, params);
    const { data } = response;

    return {
        data: data?.data,
        label: data?.label,
     };
};



const useReviewOverview = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.REPORT_REVIEW_OVERVIEW, params],
        () => fetchAnalytics(params),

        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        
        }
    );
};

export { useReviewOverview, fetchAnalytics };

