import { useMutation, useQueryClient } from "react-query";
import{ putAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from "@utils/api/endpoints";



export const useApproveProductMutation = () => {
    return useMutation(async ({ id })  =>
      await putAuthorization(`${API_ENDPOINTS.PRODUCT_APPROVE}/${id}`)
    );
};