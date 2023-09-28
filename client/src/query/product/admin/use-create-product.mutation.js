import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ postAuthorization } from "@utils/api/AxiosService";


export const useCreateProductMutation = () => {
    return useMutation(async ({ variables })  =>
      await postAuthorization(API_ENDPOINTS.PRODUCT_ADD_ADMIN, variables)
    );
};