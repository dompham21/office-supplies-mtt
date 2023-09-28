import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchReviews = async (id) => {
   
    const response = await getAuthorization(`${API_ENDPOINTS.REVIEW_DETAIL_BY_PRODUCT_ID}/${id}`);
    const { data } = response;

    return {
        review: data.data,
     };
};





const useReviewDetailByProductId = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.REVIEW_DETAIL_BY_PRODUCT_ID, id],
        () => fetchReviews(id),
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    );
};

export { useReviewDetailByProductId, fetchReviews };

