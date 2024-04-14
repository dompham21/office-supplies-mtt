import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ getAuthorization } from "@utils/api/AxiosService";

const fetchProfile = async () => {

  const  response  = await getAuthorization(API_ENDPOINTS.ME_SELLER);
  const { data } = response

  return {
    user: data.data
  };
};

const useProfileSellerQuery = () => {
  return useQuery(
    [API_ENDPOINTS.ME_SELLER],
    fetchProfile,
    { 
      retry: false,       
      refetchOnWindowFocus: false,
      keepPreviousData: true
    }
  );
};

export { useProfileSellerQuery, fetchProfile };
