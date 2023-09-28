import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchUsers = async ({ queryKey }) => {
    let [_key, params] = queryKey;
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        status
    } = params

    if(status != null && status?.length >0) {
        params = {...params, status: status.join(',')}
    }

    const response = await getAuthorization(API_ENDPOINTS.CUSTOMERS_ADMIN, params);
    const { data } = response;

    return {
        users: data?.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};


const useCustomersQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.CUSTOMERS_ADMIN, params],
        fetchUsers,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    );
};

export { useCustomersQuery, fetchUsers };

