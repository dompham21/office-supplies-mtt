import { useMutation, useQueryClient } from "react-query";
import{ putAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from "@utils/api/endpoints";



export const useUnlockSellerMutation = () => {
    return useMutation(async ({ id })  =>
      await putAuthorization(`${API_ENDPOINTS.SELLERS_UNLOCK}/${id}`)
    );
};