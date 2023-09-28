import React, { useEffect, useState } from 'react'
import { Modal, Rate, notification } from 'antd';
import Image from 'next/image';
import TextArea from '@components/ui/text-area';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Alert from '@components/ui/alert';
import { useTranslation } from 'react-i18next';
import { useAddReviewMutation } from '@data/review/use-add-review.mutation';
import { useReviewDetailByProductId } from '@data/review/use-review-by-product-id.query';
import { useUpdateReviewMutation } from '@data/review/use-update-review.mutation';
import { useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { toast } from 'react-toastify';


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



function ModalReviewProduct({isModalOpen, handleCancelModalReview, productReview, orderId}) {
    const desc = ['terrible!', 'bad!', 'normal!', 'good!', 'wonderful!'];
    const [rateValue, setRateValue] = useState(5);
    const [errorMsg, setErrorMsg] = useState("");
    const queryClient = useQueryClient();

    const { mutate: addReview, isLoading: isLoadingAdd } = useAddReviewMutation();
    const { mutate: updateReview, isLoading: isLoadingUpdate } = useUpdateReviewMutation();

    const {
        data,
        isLoading: isLoadingReview,
        error,
    } = useReviewDetailByProductId(productReview?.id);

    const [api, contextHolder] = notification.useNotification();

    const { t } = useTranslation();
    
    const defaultValues = {
        comment: "",
        vote: rateValue,
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm({
        defaultValues,
        resolver: yupResolver(commentFormSchema),
    });

    useEffect(() => {
      
        if(data?.review != null) {
            setValue("comment", data?.review?.comment)
            setRateValue(data?.review?.vote)
        }
     
    }, [data, setValue])
    
   
    
  

    function onSubmitAdd({ comment }) {
        addReview(
            {
            variables: {
                comment,
                vote: rateValue,
                productId: productReview?.id
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
                        handleCancelModalReview();
 
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
            onSettled: () => {
                queryClient.invalidateQueries([API_ENDPOINTS.ORDER_DETAIL, String(orderId)]);
            },
              
            }
        );
    }

    function onSubmitEdit({ comment }) {
        updateReview(
            {
            id: data?.review?.id,
            variables: {
                comment,
                vote: rateValue,
                productId: productReview?.id
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

                      handleCancelModalReview();
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

    const handleOkModal = () => {
        if(data?.review != null && !isLoadingReview) { //edit
            handleSubmit(onSubmitEdit)()
        }
        else if(data?.review == null && !isLoadingReview){ //addnew
            handleSubmit(onSubmitAdd)()
        } 
    }
  return (
    <Modal
        title="Đánh giá sản phẩm"
        open={isModalOpen}
        onOk={handleOkModal}
        okText="Đánh giá"
        cancelText="Trở lại"
        onCancel={handleCancelModalReview}
        width={730}
    >
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
        <div className='mt-5 flex'>
            <div className='inline-block w-16 h-16 flex-shrink-0 border mr-2.5'>
                <Image src={productReview?.image} width={64} height={64} alt={productReview?.name || "product image"} className="w-full h-full object-cover"/>
            </div>
            <div className='truncate font-bold'>{productReview?.name}</div>
        </div>
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
        
    </Modal>
  )
}

export default ModalReviewProduct