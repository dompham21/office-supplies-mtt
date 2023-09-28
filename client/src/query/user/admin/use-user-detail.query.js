import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchUser = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.USERS_ADMIN}/${id}`);
    const { data } = response;
    return {
       user: data?.data
     };
};





const useUserDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.USERS_ADMIN, id],
        () => fetchUser(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { useUserDetailQuery, fetchUser };

