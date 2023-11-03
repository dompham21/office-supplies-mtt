import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { postAuthorization } from "@utils/api/AxiosService";


export const useCreatePurchaseOrderMutation = () => {
    return useMutation(async ({ variables })  =>
      await postAuthorization(API_ENDPOINTS.PURCHASE_ORDER_ADD_ADMIN, variables)
    );
};