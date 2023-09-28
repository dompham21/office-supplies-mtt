import { useDeleteAddressMutation } from '@data/address/use-delete-address.mutation';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import ModalAddressCreateOrUpdate from './create-or-update-adress-form'
import { Modal, notification } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const { confirm } = Modal;

function AddressCard({address}) {
    const router = useRouter()
    const { mutate: deleteAddressById, isLoading: loading } = useDeleteAddressMutation();
    const [api, contextHolder] = notification.useNotification();

    const queryClient = useQueryClient();

    const handleUpdateAddress = (e) => {
        e.preventDefault()
        router.push(`/user/address/${address?.id}/edit`) 
    }

    const handleDeleteAddress = (e) => {
        e.preventDefault()
        confirm({
            title: 'Do you want to delete this address?',
            icon: <ExclamationCircleFilled />,
            centered: true,
            onOk() {
                deleteAddressById(
                    {
                      id: address?.id
                    },
                    {
                      onSuccess: ( value ) => {
                          const response  = value.data
            
                          if (response) {
                              const { result, code, status, msg } = response;
                              if(result == 1) {
                                toast.success('Xoá địa chỉ thành công!', {
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
                            toast.error('Xoá địa chỉ thất bại!', {
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
                        queryClient.invalidateQueries(API_ENDPOINTS.GET_ADDRESS);
                      },
                    
                    }
                )
            }
        });
    }

  return (
    <div className='flex py-5 border-b px-[30px]'>
         {contextHolder}
        <div className='w-full'>
        <div className='flex justify-between mb-1 items-center'>
            <div className='flex flex-grow mr-2 items-center'>
            <span className='text-base text-[#000000de] font-bold'>{address?.name}</span>
            <div className='mx-2 border-l h-6'></div>
            <div className='text-sm text-[#0000008a]'>{address?.phone}</div>
            </div>
            <div className='flex basis-24 justify-end'>
                <span className='text-sm text-[#08f] cursor-pointer' onClick={handleUpdateAddress}>Cap nhat</span>
                {
                    !address?.default_address &&
                    <span className='text-sm text-[#08f] ml-2 cursor-pointer' onClick={handleDeleteAddress}>Xoa</span>
                }
               
            </div>
        </div>
        <div className='text-sm text-[#000000de] mt-2'>
            <div className='flex items-center'>{address?.specificAddress}</div>
            <div className='flex items-center'>{address?.ward.fullName}, {address?.ward?.district?.fullName}, {address?.ward?.district?.province?.fullName}</div>
        </div>
        {
            address?.default_address && (
                <div className='mt-1 flex items-center flex-wrap'>
                    <span className='text-sm text-accent border px-1 py-0.5 border-accent'>Mặc định</span>
                </div>
            )
        }
        
        </div>
    </div>
  )
}

export default AddressCard