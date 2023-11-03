import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { get } from "@utils/api/AxiosService";

const fetchSuppliers = async () => {

  const response  = await get(API_ENDPOINTS.SUPPLIERS);
  const { data } = response

  return {
    suppliers: data.data
  };
};

const useSuppliersQuery = () => {
  return useQuery(
    [API_ENDPOINTS.SUPPLIERS],
    fetchSuppliers,
    { 
      retry: false,
      refetchOnWindowFocus: false
    }
  );
};

export { useSuppliersQuery, fetchSuppliers };
