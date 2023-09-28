import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ postAuthorization } from "@utils/api/AxiosService";


export const useCreatePromotionMutation = () => {
    return useMutation(async ({ variables })  =>
      await postAuthorization(API_ENDPOINTS.PROMOTION_ADD_ADMIN, variables)
    );
};