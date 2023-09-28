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
        status, role
    } = params

    if(status != null && status?.length >0) {
        params = {...params, status: status.join(',')}
    }

    if(role != null && role?.length >0) {
        params = {...params, role: role.join(',')}
    }

    const response = await getAuthorization(API_ENDPOINTS.STAFFS_ADMIN, params);
    const { data } = response;

    return {
        users: data?.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};


const useStaffsQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.STAFFS_ADMIN, params],
        fetchUsers,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    );
};

export { useStaffsQuery, fetchUsers };

