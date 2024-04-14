import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ post } from "@utils/api/AxiosService";


export const useVerifyForgotMutation = () => {
    return useMutation(async ({ variables })  =>
      await post(API_ENDPOINTS.VERIFY_FORGOT, variables)
    );
};