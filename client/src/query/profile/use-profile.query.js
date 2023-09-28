import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ getAuthorization } from "@utils/api/AxiosService";

const fetchProfile = async () => {

  const  response  = await getAuthorization(API_ENDPOINTS.ME);
  const { data } = response

  return {
    user: data.data
  };
};

const useProfileQuery = () => {
  return useQuery(
    [API_ENDPOINTS.ME],
    fetchProfile,
    { 
      retry: false,       
      refetchOnWindowFocus: false,
    }
  );
};

export { useProfileQuery, fetchProfile };
