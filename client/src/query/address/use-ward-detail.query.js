import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { getAuthorization, getExternalAxios } from "@utils/api/AxiosService";

const fetchAddresses = async (ward, id) => {
  const  response  = await getExternalAxios(`${API_ENDPOINTS.PROVINCE}/ward/${id}`);
  const { data } = response
  return {
    wards: data.results.filter(ward => ward.ward_id == id)
  };
};

const useWardsDetailQuery = (ward, id) => {
  return useQuery(
    [API_ENDPOINTS.WARD, ward, id, "1"],
    () => fetchAddresses(ward, id),
    { 
      retry: false,       
      refetchOnWindowFocus: false,
      enabled: id != null ? true : false,
      keepPreviousData: true
    }
  );
};

export { useWardsDetailQuery, fetchAddresses };
