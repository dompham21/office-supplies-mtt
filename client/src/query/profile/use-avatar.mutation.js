import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ postAuthorizationWithMultipart } from "@utils/api/AxiosService";


export const useAvatarMutation = () => {
    return useMutation(async ({ variables })  =>
      await postAuthorizationWithMultipart(API_ENDPOINTS.PROFILE_AVATAR, variables)
    );
};