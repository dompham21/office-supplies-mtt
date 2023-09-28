import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { putAuthorization } from "@utils/api/AxiosService";


export const useUpdateBrandMutation = () => {
    return useMutation(async ({ variables, id })  =>
      await putAuthorization(`${API_ENDPOINTS.BRAND_UPDATE_ADMIN}/${id}`, variables)
    );
};