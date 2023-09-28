import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ get } from "@utils/api/AxiosService";

const fetchPosters = async () => {

  const  response  = await get(API_ENDPOINTS.POSTERS);
  const { data } = response

  return {
    posters: data.data
  };
};

const usePostersQuery = () => {
  return useQuery(
    [API_ENDPOINTS.POSTERS],
    fetchPosters,
    { 
      retry: false,       
      refetchOnWindowFocus: false
    }
  );
};

export { usePostersQuery, fetchPosters };
