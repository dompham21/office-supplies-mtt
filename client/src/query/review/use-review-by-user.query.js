import{ get, getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchReviews = async (params) => {
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params

    
    const response = await getAuthorization(`${API_ENDPOINTS.REVIEWS_BY_USER}`, params);
    const { data } = response;

    return {
        reviews: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};





const useReviewsQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.REVIEWS_BY_USER, params],
        () => fetchReviews(params),
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    );
};

export { useReviewsQuery, fetchReviews };

