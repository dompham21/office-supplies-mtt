import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ putAuthorization } from "@utils/api/AxiosService";


export const useUpdateProductMutation = () => {
    return useMutation(async ({ variables, id })  =>
      await putAuthorization(`${API_ENDPOINTS.PRODUCT_UPDATE_ADMIN}/${id}`, variables)
    );
};