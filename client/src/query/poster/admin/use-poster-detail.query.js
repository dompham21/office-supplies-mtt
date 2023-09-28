import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchPoster = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.POSTERS_ADMIN}/${id}`);
    const { data } = response;
    return {
       poster: data?.data
     };
};





const usePosterDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.POSTERS_ADMIN, id],
        () => fetchPoster(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { usePosterDetailQuery, fetchPoster };

