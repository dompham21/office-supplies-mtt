import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ putAuthorization } from "@utils/api/AxiosService";


export const useUpdateNameMutation = () => {
    return useMutation(async ({ variables })  =>
      await putAuthorization(`${API_ENDPOINTS.PROFILE_NAME}`, variables)
    );
};