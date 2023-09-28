import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ post } from "@utils/api/AxiosService";


export const useRegisterMutation = () => {
  return useMutation( async ({ variables }) =>
    await post(API_ENDPOINTS.REGISTER, variables)
  );
};
