import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ postAuthorizationWithMultipart } from "@utils/api/AxiosService";


export const useImageMutation = () => {
    return useMutation(async ({ variables })  =>
      await postAuthorizationWithMultipart(API_ENDPOINTS.IMAGE_ADMIN, variables)
    );
};