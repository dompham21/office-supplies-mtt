import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { get } from "@utils/api/AxiosService";

const fetchBrands = async () => {

  const response  = await get(API_ENDPOINTS.BRANDS);
  const { data } = response

  return {
    brands: data.data
  };
};

const useBrandsQuery = () => {
  return useQuery(
    [API_ENDPOINTS.BRANDS],
    fetchBrands,
    { 
      retry: false,
      refetchOnWindowFocus: false
    }
  );
};

export { useBrandsQuery, fetchBrands };
