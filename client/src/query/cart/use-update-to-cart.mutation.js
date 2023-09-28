import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { putAuthorization } from "@utils/api/AxiosService";


export const useUpdateToCartMutation = () => {
  const queryClient = useQueryClient();

    return useMutation(async ({ variables })  =>
      await putAuthorization(API_ENDPOINTS.CARTS, variables)
     
    );
};