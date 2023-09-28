import { useMutation, useQueryClient } from "react-query";
import{ deleteAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from "@utils/api/endpoints";



export const useDeleteUserMutation = () => {
    return useMutation(async ({ id })  =>
      await deleteAuthorization(`${API_ENDPOINTS.USER_DELETE}/${id}`)
    );
};