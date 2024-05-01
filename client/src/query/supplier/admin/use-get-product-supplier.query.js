import { getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchListProductBySupplier = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.SUPPLIERS_PRODUCT_ADMIN}/${id}`);
    const { data } = response;
    return {
       products: data?.data
     };
};





const useProductBySupplierQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.SUPPLIERS_PRODUCT_ADMIN, id],
        () => fetchListProductBySupplier(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { useProductBySupplierQuery, fetchListProductBySupplier };

