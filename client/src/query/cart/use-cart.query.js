import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ getAuthorization } from "@utils/api/AxiosService";

const fetchCarts = async () => {

  const  response  = await getAuthorization(API_ENDPOINTS.CARTS);
  const { data } = response

  return {
    carts: data.data
  };
};

const useCartsQuery = () => {
  return useQuery(
    [API_ENDPOINTS.CARTS],
    fetchCarts,
    { 
        retry: false,       
        refetchOnWindowFocus: false
    }
  );
};

export { useCartsQuery, fetchCarts };
