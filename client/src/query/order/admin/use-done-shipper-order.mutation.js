import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ putAuthorization } from "@utils/api/AxiosService";


export const useDoneOrderShipperMutation = () => {
  const queryClient = useQueryClient();

    return useMutation(async ({ id })  =>
      await putAuthorization(`${API_ENDPOINTS.ORDERS_DONE_SHIPPER}/${id}`)
    );
};