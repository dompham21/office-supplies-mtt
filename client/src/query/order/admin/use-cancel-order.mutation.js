import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ putAuthorization } from "@utils/api/AxiosService";


export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

    return useMutation(async ({ id, variables })  =>
      await putAuthorization(`${API_ENDPOINTS.ORDERS_CANCEL_ADMIN}/${id}`, variables)
    );
};