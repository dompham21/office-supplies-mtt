import { getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchSuppliers = async ({ queryKey }) => {
    const [_key, params] = queryKey;
    const {
        pageNo,
        pageSize,
        sortField,
        sortDirection,
        } = params

    
    const response = await getAuthorization(API_ENDPOINTS.SUPPLIERS_ADMIN, params);
    const { data } = response;

    return {
        suppliers: data.data,
        totalPage: data?.totalPage,
        pageNo: data?.pageNum
     };
};





const useSuppliersQuery = ( params ) => {
    return useQuery(
        [API_ENDPOINTS.SUPPLIERS_ADMIN, params],
        fetchSuppliers,
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false

        }
    );
};

export { useSuppliersQuery, fetchSuppliers };

