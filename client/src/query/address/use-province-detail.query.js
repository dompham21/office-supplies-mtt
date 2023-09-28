import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { getAuthorization, getExternalAxios } from "@utils/api/AxiosService";

const fetchAddresses = async (id) => {

  const  response  =  await getExternalAxios(`${API_ENDPOINTS.PROVINCE}/${id}`, {"depth": 1});
  const { data } = response
  return {
    provinces: data
  };
};

const useProvincesDetailQuery = (id) => {
  return useQuery(
    [API_ENDPOINTS.PROVINCE, id, "1"],
    () => fetchAddresses(id),
    { 
      retry: false,       
      refetchOnWindowFocus: false,
      enabled: id != null ? true : false,
      keepPreviousData: true
    }
  );
};

export { useProvincesDetailQuery, fetchAddresses };
