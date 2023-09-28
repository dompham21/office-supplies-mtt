import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ deleteAuthorization } from "@utils/api/AxiosService";


export const useDeleteCartMutation = () => {
  const queryClient = useQueryClient();

    return useMutation(async ({variables})  => {
      const {id} = variables;
      return await deleteAuthorization(`${API_ENDPOINTS.CARTS}/${id}`)
    }
    );
};