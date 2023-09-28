import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchCategory = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.CATEGORIES_ADMIN}/${id}`);
    const { data } = response;
    return {
       category: data?.data
     };
};





const useCategoryDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.CATEGORIES_ADMIN, id],
        () => fetchCategory(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { useCategoryDetailQuery, fetchCategory };

