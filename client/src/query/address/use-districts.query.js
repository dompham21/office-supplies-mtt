import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { getAuthorization, getExternalAxios } from "@utils/api/AxiosService";

const fetchAddresses = async (id) => {
  const  response  = await getExternalAxios(`${API_ENDPOINTS.PROVINCE}/district/${id}`);
  const { data } = response
  return {
    districts: data.results
  };
};

const useDistrictsQuery = (id) => {
  return useQuery(
    [API_ENDPOINTS.PROVINCE, id],
    () => fetchAddresses(id),
    { 
      retry: false,       
      refetchOnWindowFocus: false,
      enabled: id != null ? true : false,
      keepPreviousData: true
    }
  );
};

export { useDistrictsQuery, fetchAddresses };
