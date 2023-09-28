import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ get } from "@utils/api/AxiosService";

const fetchCategories = async () => {

  const response  = await get(API_ENDPOINTS.CATEGORIES);
  const { data } = response

  return {
    categories: data.data
  };
};

const useCategoriesQuery = () => {
  return useQuery(
    [API_ENDPOINTS.CATEGORIES],
    fetchCategories,
    { 
      retry: false,
      refetchOnWindowFocus: false
    }
  );
};

export { useCategoriesQuery, fetchCategories };
