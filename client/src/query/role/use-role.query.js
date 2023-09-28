import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ getAuthorization } from "@utils/api/AxiosService";

const fetchRoles = async () => {

  const response  = await getAuthorization(API_ENDPOINTS.ROLES);
  const { data } = response

  return {
    roles: data.data
  };
};

const useRolesQuery = () => {
  return useQuery(
    [API_ENDPOINTS.ROLES],
    fetchRoles,
    { 
      retry: false,
      refetchOnWindowFocus: false
    }
  );
};

export { useRolesQuery, fetchRoles };
