import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { postAuthorization } from "@utils/api/AxiosService";


export const useCreateSupplierMutation = () => {
    return useMutation(async ({ variables })  =>
      await postAuthorization(API_ENDPOINTS.SUPPLIERS_ADD_ADMIN, variables)
    );
};