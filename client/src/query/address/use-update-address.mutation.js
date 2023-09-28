import { useMutation } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { putAuthorization } from "@utils/api/AxiosService";


export const useUpdateAddressMutation = () => {
    return useMutation(async ({ variables, id })  =>
      await putAuthorization(`${API_ENDPOINTS.ADDRESS_UPDATE}/${id}`, variables)
    );
};