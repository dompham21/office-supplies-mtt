import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import{ putAuthorization } from "@utils/api/AxiosService";

export const useSetShipperMutation = () => {  

    return useMutation(async ({ variables, id })  =>
    await putAuthorization(`${API_ENDPOINTS.ORDERS_SHIPPER_ADMIN}/${id}`, variables)
    );
};