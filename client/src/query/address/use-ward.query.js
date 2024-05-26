import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { getAuthorization, getExternalAxios } from "@utils/api/AxiosService";

const fetchAddresses = async (id) => {
  const  response  = await getExternalAxios(`${API_ENDPOINTS.PROVINCE}/ward/${id}`);
  const { data } = response
  return {
    wards: data?.results
  };
};

const useWardsQuery = (id) => {
  return useQuery(
    [API_ENDPOINTS.DISTRICT, id],
    () => fetchAddresses(id),
    { 
      retry: false,       
      refetchOnWindowFocus: false,
      enabled: id != null ? true : false,
      keepPreviousData: true
    }
  );
};

export { useWardsQuery, fetchAddresses };
