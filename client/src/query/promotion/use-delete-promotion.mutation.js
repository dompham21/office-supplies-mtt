import { useMutation, useQueryClient } from "react-query";
import{ deleteAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from "@utils/api/endpoints";



export const useDeletePromotionMutation = () => {
    return useMutation(async ({ id })  =>
      await deleteAuthorization(`${API_ENDPOINTS.PROMOTION_DELETE}/${id}`)
    );
};