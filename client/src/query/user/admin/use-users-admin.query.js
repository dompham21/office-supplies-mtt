import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchUsers = async ({ queryKey }) => {
    const [_key, params] = queryKey;
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params

    
    const response = await getAuthorization(API_ENDPOINTS.USERS_ADMIN, params);
    const { data } = response;

    return {
        users: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};





const useUsersQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.USERS_ADMIN, params],
        fetchUsers,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    );
};

export { useUsersQuery, fetchUsers };

