import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { getAuthorization, getExternalAxios } from "@utils/api/AxiosService";

const fetchAddresses = async (province, id) => {

  const  response  =  await getExternalAxios(`${API_ENDPOINTS.PROVINCE}/district/${province}`);
  const { data } = response
  return {
    districts: data.results.filter(district => district.district_id == id)
  };
};

const useDistrictsDetailQuery = (province, id) => {
  return useQuery(
    [API_ENDPOINTS.DISTRICT, province, id, "1"],
    () => fetchAddresses(province, id),
    { 
      retry: false,       
      refetchOnWindowFocus: false,
      enabled: id != null ? true : false,
      keepPreviousData: true
    }
  );
};

export { useDistrictsDetailQuery, fetchAddresses };
