import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchPromotion = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.PROMOTIONS_ADMIN}/${id}`);
    const { data } = response;
    return {
       promotion: data?.data
     };
};





const usePromotionDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.PROMOTIONS_ADMIN, id],
        () => fetchPromotion(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { usePromotionDetailQuery, fetchPromotion };

