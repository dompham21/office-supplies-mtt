import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchAnalytics = async (params) => {
    
    const response = await getAuthorization(API_ENDPOINTS.REPORT_PROFIT_BETWEEN, params);
    const { data } = response;

    return {
        data: data?.data,
        label: data?.label,
     };
};



const useProfitBetweenQuery = ( params ) => {
    const {fromDate, toDate} = params;

    return useQuery(
        [API_ENDPOINTS.REPORT_PROFIT_BETWEEN, params],
        () => fetchAnalytics(params),
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            enabled: fromDate && toDate ? true : false
        }
    );
};

export { useProfitBetweenQuery, fetchAnalytics };

