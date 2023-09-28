import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ getAuthorization } from "@utils/api/AxiosService";

const fetchProfile = async () => {

  const  response  = await getAuthorization(API_ENDPOINTS.ME_ADMIN);
  const { data } = response

  return {
    user: data.data
  };
};

const useProfileAdminQuery = () => {
  return useQuery(
    [API_ENDPOINTS.ME_ADMIN],
    fetchProfile,
    { 
      retry: false,       
      refetchOnWindowFocus: false,
      keepPreviousData: true
    }
  );
};

export { useProfileAdminQuery, fetchProfile };
