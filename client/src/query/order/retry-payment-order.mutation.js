import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ getAuthorization, putAuthorization } from "@utils/api/AxiosService";


export const useRetryPayment = () => {
  const queryClient = useQueryClient();

  return useMutation(async ({ id })  =>
    await putAuthorization(`${API_ENDPOINTS.RETRY_PAYMENT_ORDER}/${id}`)
  );
};