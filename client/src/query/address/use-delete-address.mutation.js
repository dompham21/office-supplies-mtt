import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { deleteAuthorization } from "@utils/api/AxiosService";



export const useDeleteAddressMutation = () => {
    return useMutation(async ({ id })  =>
      await deleteAuthorization(`${API_ENDPOINTS.ADDRESS_DELETE}/${id}`)
    );
};