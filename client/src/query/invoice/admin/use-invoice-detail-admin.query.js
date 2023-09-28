import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';


const fetchInvoice = async (id) => {
    
    const response = await getAuthorization(`${API_ENDPOINTS.INVOICE_ADMIN}/${id}`);
    const { data } = response;
    return {
       invoice: data?.data
     };
};





const useInvoiceDetailAdminQuery = ( id ) => {
    return useQuery(
        [API_ENDPOINTS.INVOICE_ADMIN, id],
        () => fetchInvoice(id),
        {   
            retry: false,
            enabled: id ? true : false,
            refetchOnWindowFocus: false

        }
    );
};

export { useInvoiceDetailAdminQuery, fetchInvoice };

