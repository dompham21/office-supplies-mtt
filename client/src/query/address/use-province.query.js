import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { getAuthorization, getExternalAxios } from "@utils/api/AxiosService";

const fetchAddresses = async () => {

  const  response  = await getExternalAxios(API_ENDPOINTS.PROVINCE);
  const { data } = response
  return {
    provinces: data
  };
};

const useProvincesQuery = () => {
  return useQuery(
    [API_ENDPOINTS.PROVINCE],
    fetchAddresses,
    { 
      retry: false,       
      refetchOnWindowFocus: false,
      keepPreviousData: true
    }
  );
};

export { useProvincesQuery, fetchAddresses };
