import{ get } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchReviews = async (params, id) => {
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params

    
    const response = await get(`${API_ENDPOINTS.REVIEWS_BY_PRODUCT}/${id}`, params);
    const { data } = response;

    return {
        reviews: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};





const useReviewsQuery = ( params, id ) => {
    return useQuery(
        [API_ENDPOINTS.REVIEWS_BY_PRODUCT, params],
        () => fetchReviews(params, id),
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    );
};

export { useReviewsQuery, fetchReviews };

