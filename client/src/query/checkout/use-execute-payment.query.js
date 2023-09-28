import{ getAuthorization } from "@utils/api/AxiosService";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import {
QueryKey,
useInfiniteQuery,
UseInfiniteQueryOptions,
useQuery,
} from 'react-query';
import { toast } from "react-toastify";
import { useRouter } from 'next/router'


const fetchExecutePayment = async (params) => {
    
    const response = await getAuthorization(API_ENDPOINTS.PAYPAL_EXECUTE, params);
    const { data } = response;


    return {
        data: data?.data,
     };
};



const useExecutePayment = ( params ) => {
    const router = useRouter()

    return useQuery(
        [API_ENDPOINTS.PAYPAL_EXECUTE, params],
        () => fetchExecutePayment(params),
        {   
            retry: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            enabled: params?.paymentId !== null && params?.PayerID !== null,
            onError: (error) => {
                router.push("/user/order")

                if(error?.response?.data?.msg) {
                    toast.error(error?.response?.data?.msg, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
                else {
                    toast.error("Thanh toán đơn hàng thất bại, hãy thử lại sau!", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
               
            },
            onSuccess: (data) => {
                router.push("/user/order")
                toast.success('Đặt hàng thành công!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
    );
};

export { useExecutePayment, fetchExecutePayment };

