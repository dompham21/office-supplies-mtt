import{ putAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation } from "react-query";



export const useChangePasswordMutation = () => {
  return useMutation(({ variables }) =>
    putAuthorization(API_ENDPOINTS.CHANGE_PASSWORD, variables)
  );
};
