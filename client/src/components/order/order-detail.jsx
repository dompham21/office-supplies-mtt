import { currencyMoney } from '@utils/format-currency'
import Image from 'next/image'
import React, { useState } from 'react'
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useRequestCancelMutation } from '@data/order/request-cancel-order.mutation';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { useQueryClient } from 'react-query'
import { Button, Modal, Select, notification } from 'antd';
import { useRouter } from 'next/router';
import ModalReviewProduct from '@components/review/modal-review';
import { toast } from 'react-toastify';
import { default as productPlaceHolder } from '@assets/placeholders/product.svg';
import formatDateDDMMYYYY from '@utils/format-date-dd-mm-yyyy';
import { CHECKED_LIST } from '@utils/constants'
import { useRetryPayment } from '@data/order/retry-payment-order.mutation';

const { confirm } = Modal;


function OrderDetail({order}) {
  const router = useRouter()
  const [isModalOpenCancelOrder, setIsModalOpenCancelOrder] = useState(false);
  const [reasonCancel, setReasonCancel] = useState(null);
  const [isModalOpen, setIsOpen] = useState(false);
  const [productReview, setProductReview] = useState(null);


  const { address, orderDetails, status, totalPrice, id, name, phone, date } = order
  console.log(order)
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
                <Button className='w-44' type='primary' loading={isLoadingRequestCancel} style={{height:'40px'}} onClick={()=>setIsModalOpenCancelOrder(true)}>Huỷ đơn hàng</Button>
                <Button className='w-44' type='primary' loading={isLoadingRetry} style={{height:'40px'}} onClick={handleRetryPayment}>Thanh toán</Button>
              </div>
            )
            
        case 2:
        case 3:
            return <Button className='w-44' disabled={true} style={{height:'40px'}}>Đang xử lý</Button>
        default:
            return null;
    }
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

                  queryClient.setQueryData(
                    [API_ENDPOINTS.ORDER_DETAIL, id.toString()],
                    (oldData) => oldData ? {
                      ...oldData,
                      order: data
                    } : oldData
                  )

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
          queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.ORDER_DETAIL, id?.toString]});
        },
        
      }
    )
    setIsModalOpenCancelOrder(false)
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
          
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.ORDER_DETAIL, id?.toString]});
          },
        
      }
    )
}

const handleCancelModalReview = () => {
  setIsOpen(false)
}

const handleOpenReviewModal = (e, product) => {
  e.preventDefault()
  setIsOpen(true)
  setProductReview(product)

}

const handleChangeReasonCancel = (value) => {
  setReasonCancel(value)
};

  return (
      <div>
        {contextHolder}
        {
          isModalOpen &&
          <ModalReviewProduct orderId={id} isModalOpen={isModalOpen} productReview={productReview} handleCancelModalReview={handleCancelModalReview}></ModalReviewProduct>
        }
        <Modal title="Huỷ đơn hàng" open={isModalOpenCancelOrder} onOk={handleCancelOrder} onCancel={()=>setIsModalOpenCancelOrder(false)} destroyOnClose={true}>
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
        <div className='bg-white rounded shadow-sm px-6 py-5 flex justify-between items-center border-b'>
          <div>Ngày tạo: {formatDateDDMMYYYY(date)}</div>
          <div>
            <span>MÃ ĐƠN HÀNG: {id}</span>
            <span className='mx-4'>|</span>
            <span className='text-accent'>{renderStatus(status?.id)}</span>
          </div>
        </div>
        <div className='py-7 px-[30px] bg-white rounded overflow-hidden shadow-sm mb-3 flex flex-col'>
          <div className='flex items-center text-lg text-accent mb-5 capitalize'>
          Địa Chỉ Nhận Hàng
          </div>
        
          <div className='flex items-center'>
              <div className='flex text-base items-center'>
                  
                  <div className='font-bold color-black'>{name} | {phone}</div>
                  <div className='ml-5' style={{wordBreak: "break-word"}}>{address}</div>
              </div>
          </div>
        </div>
        <div className='bg-white rounded shadow-sm px-[30px] mb-3'>
          {
            orderDetails && orderDetails?.map(od => (

                <div className='py-2 flex items-center border-b' key={od?.product?.id} >
                    <div className='flex items-start flex-nowrap' style={{flex: 1}}>
                        <Image src={od?.product?.images && od?.product?.images.length > 0 ? od?.product?.images[0] : productPlaceHolder} alt={od?.product?.name || "product name"} width={80} height={80} className='w-20 h-20 object-cover'/>
                        <div className='flex flex-col ml-4 items-start' style={{flex: 1}}>
                            <div className='truncate text-base'>{od?.product?.name}</div>
                            <div>x{od?.quantity}</div>
                        </div>
                    </div>
                    <div className='flex flex-col items-end'>
                      <div>{currencyMoney(od?.unitPrice)}</div>
                      <div>
                        {
                          status?.id == 4 && od.hasReviewed == false && <Button className='mt-2 text-sm capitalize' style={{height: "36px"}} onClick={(e) => handleOpenReviewModal(e, od?.product)}>Đánh giá</Button>
                        }       
                        {
                          status?.id == 4 && od.hasReviewed == true && <Button className='mt-2 text-sm capitalize' style={{height: "36px"}} onClick={(e) => handleOpenReviewModal(e, od?.product)}>Sửa đánh giá</Button>
                        }                 
                      </div>
                    </div>
                    
                </div>
            ))
          }
        </div>
        <div className='bg-white rounded overflow-hidden shadow-sm mb-3 flex flex-col'>
          <div className='px-[30px] flex items-center min-h-[90px]'>
              <div className='flex-1'>Phương thức thanh toán</div>
              <div className='text-sm text-[#222]'>Paypal</div>
          </div>
          <div className='border-y pt-4 flex justify-end'>
            <div className='flex flex-col items-center'>
              <div className='min-h-[40px] flex items-center'>Tổng tiền hàng:</div>
              <div className='min-h-[40px] flex items-center'>Tổng thanh toán:</div>
            </div>
            <div className='flex flex-col items-center ml-4'>
              <div className='pr-5 pl-2.5 min-h-[40px] w-full flex  items-center justify-end'>{currencyMoney(totalPrice)}</div>
              <div className='pr-5 pl-2.5 min-h-[40px] w-full flex items-center justify-end text-2xl font-bold text-accent'>{currencyMoney(totalPrice)}</div>
            </div>
          </div>
          <div className='min-h-[95px] flex items-center justify-end px-[30px]'>
            {renderButton(status?.id)}
          </div>
        </div>
      </div>
    )
}

export default OrderDetail