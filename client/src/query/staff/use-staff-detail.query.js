import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchUser = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.STAFFS_ADMIN}/${id}`);
    const { data } = response;
    return {
       user: data?.data
     };
};





const useStaffDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.STAFFS_ADMIN, id],
        () => fetchUser(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { useStaffDetailQuery, fetchUser };

