import React, { useEffect, useRef, useState } from 'react'
import { Modal, Rate, notification } from 'antd';
import Image from 'next/image';
import TextArea from '@components/ui/text-area';
import { useForm, Control, FieldErrors, } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Alert from '@components/ui/alert';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import Input from '@components/ui/input';
import SelectInput from '@components/ui/select-input';
import { useProvincesQuery } from '@data/address/use-province.query';
import ValidationError from '@components/ui/form-validation-error';
import { useDistrictsQuery } from '@data/address/use-districts.query';
import { useWardsQuery } from '@data/address/use-ward.query';
import SwitchInput from '@components/ui/switch-input';
import { useDetailAddressQuery } from '@data/address/use-detail-address.query';
import Button from '@components/ui/button';
import { useCreateAddressMutation } from '@data/address/use-create-address.mutation';
import { useUpdateAddressMutation } from '@data/address/use-update-address.mutation';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useAddReviewMutation } from '@data/review/use-add-review.mutation';
import { useUpdateReviewMutation } from '@data/review/use-update-review.mutation';


const commentFormSchema = yup.object().shape({
    comment: yup
      .string()
      .required("form:error-email-required"),
    vote: yup
        .number()
        .min(1, "Must be greater than 0")
        .max(5, "Must be less or equal than 5")
        .required("form:error-password-required"),
});



const defaultValues = {
    comment: "",
    vote: 5
};

function CreateOrUpdateReviewForm({initialValues}) {
    const [errorMsg, setErrorMsg] = useState("");
    const queryClient = useQueryClient();
    const [rateValue, setRateValue] = useState(5);
    const desc = ['terrible!', 'bad!', 'normal!', 'good!', 'wonderful!'];

    const router = useRouter()

    const { mutate: addReview, isLoading: isLoadingAdd } = useAddReviewMutation();
    const { mutate: updateReview, isLoading: isLoadingUpdate } = useUpdateReviewMutation();
 

    const [api, contextHolder] = notification.useNotification();

    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
      } = useForm({
        defaultValues: initialValues ? {
            comment: initialValues?.comment,
            vote:  initialValues?.vote
        } : defaultValues,
        resolver: yupResolver(commentFormSchema),
    });

    const onSubmit = async (values) => {


        const input = {
            comment: values.comment,
            vote: values.vote
        };

        if(initialValues) {
            updateReview(
                {
                    id: initialValues?.id,
                    variables: {
                        
                        productId: 144,
                        ...input
                    },
                },
                {
                onSuccess: ( value ) => {
                    const response  = value.data
    
                    if (response) {
                        const { result, code, status, msg} = response;
                        if(result == 1) {
                            toast.success('Sửa đánh giá thành công!', {
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
                        else if(result == 0) {
                            setErrorMsg(msg);
                            return;
                        }
                    } else {
                        toast.error('Sửa đánh giá thất bại!', {
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
                onError: (error) => {
                  
    
                    if(error?.response?.status == 400) {
                        if(error?.response?.data?.msg) {
                            setErrorMsg(error?.response?.data?.msg)
    
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
                    }
                    else {
                        toast.error('Lỗi máy chủ, xin hãy thử lại sau!', {
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
                onSettled: () => {
                    queryClient.invalidateQueries([API_ENDPOINTS.REVIEW_DETAIL_BY_PRODUCT_ID, productReview?.id]);
                },
                  
            });
        }
        else {
            addReview(
                {
                    variables: {
                        productId: 114,
                        ...input
                    },
                },
                {
                onSuccess: ( value ) => {
                    const response  = value.data
    
                    if (response) {
                        const { result, data, code, status, msg } = response;
                        if(result == 1) {
                            toast.success('Thêm đánh giá thành công!', {
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
                        else if(result == 0) {
                            setErrorMsg(msg);
                            return;
                        }
                    } else {
                        toast.error('Thêm đánh giá thất bại!', {
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
                onError: (error) => {
                  
    
                    if(error?.response?.status == 400) {
                        if(error?.response?.data?.msg) {
                            setErrorMsg(error?.response?.data?.msg)
    
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
                    }
                    else {
                        toast.error('Lỗi máy chủ, xin hãy thử lại sau!', {
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
            }
            );
        }
    }

    
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='px-[30px] py-6'>
        {contextHolder}

        {errorMsg ? (
        <Alert
            message={errorMsg}
            variant="error"
            closeable={true}
            className="mb-5"
            onClose={() => setErrorMsg("")}
        />
        ) : null}
        {/* <div className='mt-5 flex'>
            <div className='inline-block w-16 h-16 flex-shrink-0 border mr-2.5'>
                <Image src={productReview?.image} width={64} height={64} alt={productReview?.name || "product image"} className="w-full h-full object-cover"/>
            </div>
            <div className='truncate font-bold'>{productReview?.name}</div>
        </div> */}
        <div className='my-5 flex items-center'>
            <div className='mr-5 mt-1'>Chất lượng sản phẩm</div>
            <div className='flex items-center'>
                <Rate allowClear={false} value={rateValue}  onChange={setRateValue} className='text-3xl'/>
                {rateValue ? <span className="ant-rate-text mt-1 capitalize font-semibold">{desc[rateValue - 1]}</span> : ''}
            </div>
        </div>
        <div>
            <TextArea
                {...register("comment")}
                error={errors?.comment?.message}
                variant="outline"/>
        </div>
        
    </form>
  )
}

export default CreateOrUpdateReviewForm