import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { postAuthorization, putAuthorization } from "@utils/api/AxiosService";


export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

    return useMutation(async ({ variables })  =>
      await postAuthorization(API_ENDPOINTS.CART_ADD, variables)
    );
};