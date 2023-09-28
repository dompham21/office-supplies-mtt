import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ postAuthorization } from "@utils/api/AxiosService";


export const useCheckoutMutation = () => {
  const queryClient = useQueryClient();

    return useMutation(async ({ variables })  =>
      await postAuthorization(API_ENDPOINTS.CHECKOUT, variables)
    );
};