import { getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchSupplier = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.SUPPLIERS_ADMIN}/${id}`);
    const { data } = response;
    return {
       supplier: data?.data
     };
};





const useSupplierDetailQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.SUPPLIERS_ADMIN, id],
        () => fetchSupplier(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { useSupplierDetailQuery, fetchSupplier };

