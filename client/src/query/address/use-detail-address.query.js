import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { getAuthorization } from "@utils/api/AxiosService";

const fetchAddresses = async (id) => {
  const  response  = await getAuthorization(`${API_ENDPOINTS.ADDRESS}/${id}`);
  const { data } = response

  return {
    address: data.data
  };
};

const useDetailAddressQuery = (id) => {
  return useQuery(
    [API_ENDPOINTS.ADDRESS, id],
    () => fetchAddresses(id),
    { 
      retry: false,       
      refetchOnWindowFocus: false,
      enabled: id != null ? true : false,
      keepPreviousData: true
    }
  );
};

export { useDetailAddressQuery, fetchAddresses };
