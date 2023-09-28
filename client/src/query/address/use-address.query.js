import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { getAuthorization } from "@utils/api/AxiosService";

const fetchAddresses = async () => {

  const  response  = await getAuthorization(API_ENDPOINTS.GET_ADDRESS);
  const { data } = response

  return {
    addresses: data.data
  };
};

const useAddressesQuery = () => {
  return useQuery(
    [API_ENDPOINTS.GET_ADDRESS],
    fetchAddresses,
    { 
      retry: false,       
      refetchOnWindowFocus: false
    }
  );
};

export { useAddressesQuery, fetchAddresses };
