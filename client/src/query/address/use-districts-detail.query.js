import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { getAuthorization, getExternalAxios } from "@utils/api/AxiosService";

const fetchAddresses = async (id) => {

  const  response  =  await getExternalAxios(`${API_ENDPOINTS.DISTRICT}/${id}`, {"depth": 1});
  const { data } = response
  return {
    districts: data
  };
};

const useDistrictsDetailQuery = (id) => {
  return useQuery(
    [API_ENDPOINTS.DISTRICT, id, "1"],
    () => fetchAddresses(id),
    { 
      retry: false,       
      refetchOnWindowFocus: false,
      enabled: id != null ? true : false,
      keepPreviousData: true
    }
  );
};

export { useDistrictsDetailQuery, fetchAddresses };
