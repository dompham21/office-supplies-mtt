import { currencyMoney } from '@utils/format-currency';
import Image from 'next/image'
import React, { useState } from 'react'
import { default as productPlaceHolder } from '@assets/placeholders/product.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Input, Modal, Select, notification } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useRequestCancelMutation } from '@data/order/request-cancel-order.mutation';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify';
import formatDateDDMMYYYY from '@utils/format-date-dd-mm-yyyy';
import { useRetryPayment } from '@data/order/retry-payment-order.mutation';
import { CHECKED_LIST } from '@utils/constants'

const { confirm } = Modal;
function OrderCard({order, type, params}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reasonCancel, setReasonCancel] = useState(null);

    const router = useRouter()
    const { orderDetails, status, totalPrice, id, date } = order;
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient();



    const { mutate: requestCancel, isLoading: isLoadingRequestCancel } = useRequestCancelMutation();
    const { mutate: retryPayment, isLoading: isLoadingRetry } = useRetryPayment();


    const renderStatus = (id) => {
        if(id == null) {
            return null;
        }

        switch(id) {
            case 1:
                return "Chờ thanh toán"
            case 2:
                return "Chờ duyệt"
            case 3:
                return "Đang giao"
            case 4: 
                return "Hoàn thành"
            case 5:
                return "Đã hủy"
            case 6:
                return "Yêu cầu huỷ"
            default:
                return null;
        }
    }

    const renderButton = (id) => {
        if(id == null) {
            return null;
        }

        switch(id) {
            case 1:
                return (
                    <div className='flex gap-2'>
                        <Button type='primary' className='w-36' loading={isLoadingRequestCancel} style={{height:'40px'}} onClick={()=>setIsModalOpen(true)}>Huỷ đơn hàng</Button>
                        <Button type='primary' className='w-36' loading={isLoadingRetry} style={{height:'40px'}} onClick={handleRetryPayment}>Thanh toán</Button>
                    </div>
                )
            case 2:
            case 3:
                return <Button className='w-36' disabled={true} style={{height:'40px'}}>Đang xử lý</Button>
            case 4: 
                return <Button type='primary' className='w-36' style={{height:'40px'}} onClick={handleClickOrder}>Xem chi tiết</Button>
            default:
                return null;
        }
    }

    const handleRepurchaseOrder = () => {

    }

    const handleCancelOrder = () => {
      if(!reasonCancel) {
        toast.error('Vui lòng chọn lý do huỷ đơn hàng!', {
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
        requestCancel(
          {
            id: id, 
            variables: {
             reasonCancel
            }
          },
          {
            onSuccess: ( value ) => {
                const response  = value.data
  
                if (response) {
                    const { result, code, data, status, msg } = response;
                    if(result == 1) {    
                      toast.success('Huỷ đơn hàng thành công!', {
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
                      toast.error(msg, {
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
                } else {
                  toast.error('Huỷ đơn hàng thất bại!', {
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
              queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.GET_ORDERS, type, params]});
            }
          }
        )
        setIsModalOpen(false);
      }
    }
    
    const handleRetryPayment = () => {
    
      retryPayment(
          {
              id: id
          },
          {
              onSuccess: ( value ) => {
                  const response  = value.data
    
                  if (response) {
                      const { result, code, status, msg } = response;
                      if(result == 1) {
                        window.open(response.data, "_self");
                      }
                      else if(result == 0) {
                        toast.error(msg, {
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
                  } else {
                    toast.error('Thanh toán thất bại!', {
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
              
              // Always refetch after error or success:
              onSettled: () => {
                queryClient.invalidateQueries(API_ENDPOINTS.CARTS);
              },
            
          }
        )
    }
    

    const handleClickOrder = (e) => {
        e.preventDefault()
        router.push(`/user/order/${id}`)
    }

    const handleChangeReasonCancel = (value) => {
      setReasonCancel(value)
    };

    return (
        <div className='mt-4 bg-white rounded shadow-sm'>
            {contextHolder}
            <Modal title="Huỷ đơn hàng" open={isModalOpen} onOk={handleCancelOrder} onCancel={()=>setIsModalOpen(false)} destroyOnClose={true}>
              <div className='my-2 text-sm'>Chọn lý do huỷ:</div>
              <Select
                className='w-full'
                placeholder="Lý do huỷ"
                onChange={handleChangeReasonCancel}
                options={[
                  { value: 1, label: 'Tôi muốn thay đổi sản phẩm' },
                  { value: 2, label: 'Tôi tìm thấy chỗ mua khác tốt hơn' },
                  { value: 3, label: 'Tôi không có nhu cầu mua nữa' },
                  { value: 4, label: 'Phí vận chuyển cao'},
                  { value: 5, label: 'Khác'},
                ]}
              />
            </Modal>
            <div className='px-6 pb-4 pt-6 border-b  cursor-pointer' onClick={handleClickOrder}>
                <div className='pb-4 flex items-center text-base justify-between border-b text-accent'>
                    <div>Ngày tạo: {formatDateDDMMYYYY(date)}</div>
                    <div>
                        <span>MÃ ĐƠN HÀNG: {id}</span>
                        <span className='mx-4'>|</span>
                        <span className='text-accent'>{renderStatus(status?.id)}</span>
                    </div>
                </div>
                {
                    orderDetails && orderDetails?.map(od => (

                        <div className='pt-4 flex items-center last:border-b-0 border-b' key={od?.product?.id} >
                            <div className='flex items-start flex-nowrap' style={{flex: 1}}>
                                <Image src={od?.product?.images && od?.product?.images.length > 0 ? od?.product?.images[0] : productPlaceHolder} alt={od?.product?.name || "product name"} width={80} height={80} className='w-20 h-20 object-cover'/>
                                <div className='flex flex-col ml-4 items-start' style={{flex: 1}}>
                                    <div className='truncate text-base'>{od?.product?.name}</div>
                                    <div>x{od?.quantity}</div>
                                </div>
                            </div>
                            <div>{currencyMoney(od?.unitPrice)}</div>
                        </div>
                    ))
                }
            
            </div>
            <div className='px-6 pt-6 pb-4 flex items-center justify-end'>
                <div className='text-2xl text-accent font-medium'>{currencyMoney(totalPrice)}</div>
            </div>
            <div className='px-6 pt-4 pb-6 flex items-center justify-end'>
                {renderButton(status?.id)}
            </div>
        </div>
    )
}

export default OrderCard