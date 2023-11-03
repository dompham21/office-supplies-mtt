import { useForm, FormProvider } from "react-hook-form";

import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Fragment, useState } from "react";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import TextArea from "@components/ui/text-area";
import Radio from "@components/ui/radio/radio";
import SwitchInput from "@components/ui/switch-input";
import CategorySelectInput from "@components/categories/category-select-input";
import BrandSelectInput from "@components/brand/brand-select-input";
import InputNumberOnly from "@components/ui/input-number";
import FileInput from "@components/ui/file-input";
import Button from "@components/ui/button";
import { useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import Alert from "@components/ui/alert";
import { useUpdateUserMutation } from "@data/user/admin/use-update-user.mutation";
import RoleSelectInput from "@components/role/RoleSelectInput";
import { toast } from "react-toastify";
import { Input, Modal } from "antd";
import ProfileUpdateForm from "@components/profile/profile-update-form";
import { AiFillCamera } from "react-icons/ai";
import Image from "next/image";
import formatDateDDMMYYYY from "@utils/format-date-dd-mm-yyyy";
import { useCustomerDetailQuery } from "@data/user/admin/use-customer-detail.query";
import Loader from "@components/ui/loaders/loader";
import ErrorMessage from "@components/ui/error-message";
import { usereceiptDetailQuery } from "@data/purchase/admin/use-purchase-order-detail.query";
import { currencyMoney } from "@utils/format-currency";
import { useReceiptDetailQuery } from "@data/receipt/admin/use-receipt-detail.query";

export default function ViewReceiptDetail({ id, open, setIsModalOpen }) {
  const {
    data,
    isLoading: loading,
    error,
  } = useReceiptDetailQuery(id);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const calculatorTotal = (listReceiptDetails) => {
    let total = 0;
    listReceiptDetails?.map(item => {
      total += (item?.unitPrice * item?.quantity)
    })
    return total;
  }

  const isValid = !loading && data?.receipt
  return (
    <Modal open={open} onOk={handleOk} onCancel={handleCancel} width={1014} centered>
     
      <div className='flex flex-col bg-white rounded shadow-sm max-h-[780px] overflow-y-auto'>
        <div className='px-[30px] py-6 flex items-center border-b'>
            <h1 className="text-lg font-semibold text-heading">
          Thông tin chi tiết phiếu nhập
            </h1>
        </div>
        {
          isValid ? 
          <div className='px-[30px] py-6 flex items-start'>
            <div style={{flex: 1}}>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[30%] flex justify-start items-center pb-[30px]'>
                Mã phiếu nhập:
                </div>
                <div className='pl-5 flex-1 flex items-center  pb-[30px] font-medium'>
                  <div>{data?.receipt?.id}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[30%] flex justify-start items-center pb-[30px]'>
                Mã phiếu đặt:
                </div>
                <div className='pl-5 flex-1 flex items-center  pb-[30px] font-medium'>
                  <div>{data?.receipt?.purchaseOrder?.id}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[30%] flex justify-start items-center pb-[30px]'>
                Tên nhà cung cấp:
                </div>
                <div className='pl-5 flex-1 flex items-center  pb-[30px]  font-medium'>
                  <div>{data?.receipt?.purchaseOrder?.supplier?.name}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[30%] flex justify-start items-center pb-[30px]'>
                Email nhà cung cấp:
                </div>
                <div className='pl-5 flex-1 flex items-center  pb-[30px]  font-medium'>
                    <div>{data?.receipt?.purchaseOrder?.supplier?.email}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[30%] flex justify-start items-center pb-[30px]'>
                SĐT nhà cung cấp:
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]  font-medium'>
                    <div>{data?.receipt?.purchaseOrder?.supplier?.phone}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[30%] flex justify-start items-center pb-[30px]'>
                Website nhà cung cấp:
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]  font-medium'>
                    <div>{data?.receipt?.purchaseOrder?.supplier?.website}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[30%] flex justify-start items-center pb-[30px]'>
                Địa chỉ nhà cung cấp:
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]  font-medium'>
                    <div>{data?.receipt?.purchaseOrder?.supplier?.address}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[30%] flex justify-start items-center pb-[30px]'>
                Thời gian tạo
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]  font-medium'>
                    <div>{formatDateDDMMYYYY(data?.receipt?.date)}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[30%] flex justify-start items-center pb-[30px]'>
                Nhân viên đặt
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]  font-medium'>
                    <div>{data?.receipt?.purchaseOrder?.staff?.name}</div>
                </div>
              </div>
            </div>
            <div className='flex justify-center h-full border-l w-96 pl-4 flex-col'>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[30%] flex justify-start items-center pb-[30px]'>
                Tổng giá trị:
                </div>
                <div className='pl-5 flex-1 flex items-center  pb-[30px] font-medium'>
                  <div>{currencyMoney(calculatorTotal(data?.receipt?.purchaseOrder?.purchaseOrderDetails))}</div>
                </div>
              </div>
              <div className="font-bold text-base mb-4">Danh sách sản phẩm</div>
              <div className="flex flex-col">
              {
                data?.receipt?.purchaseOrder?.purchaseOrderDetails && data?.receipt?.purchaseOrder?.purchaseOrderDetails?.map(od => (

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
                    </div>
                    
                </div>
              ))}
              </div>
              
            </div>
          </div> :
          error ? <ErrorMessage message={error?.response?.data?.msg} /> :
          <Loader text={"Loading"} />
        }

       
      </div>
    </Modal>
    
  );
}
