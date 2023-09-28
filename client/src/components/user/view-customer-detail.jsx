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

export default function ViewCustomerDetail({ id, open, setIsModalOpen }) {
  const {
    data,
    isLoading: loading,
    error,
  } = useCustomerDetailQuery(id);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const isValid = !loading && data?.user
  return (
    <Modal open={open} onOk={handleOk} onCancel={handleCancel} width={1014} centered>
     
      <div className='flex flex-col bg-white rounded shadow-sm max-h-[780px] overflow-y-auto'>
        <div className='px-[30px] py-6 flex items-center border-b'>
            <h1 className="text-lg font-semibold text-heading">
          Thông tin chi tiết thông tin khách hàng 
            </h1>
        </div>
        {
          isValid ? 
          <div className='px-[30px] py-6 flex items-start'>
            <div className='pr-12' style={{flex: 1}}>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-start items-center pb-[30px]'>
                Mã khách hàng:
                </div>
                <div className='pl-5 flex-1 flex items-center  pb-[30px] font-medium'>
                  <div>{data?.user?.id}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-start items-center pb-[30px]'>
                Tên khách hàng:
                </div>
                <div className='pl-5 flex-1 flex items-center  pb-[30px]  font-medium'>
                  <div>{data?.user?.name}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-start items-center pb-[30px]'>
                Email:
                </div>
                <div className='pl-5 flex-1 flex items-center  pb-[30px]  font-medium'>
                    <div>{data?.user?.email}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-start items-center pb-[30px]'>
                Số điện thoại
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]  font-medium'>
                    <div>{data?.user?.phone}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-start items-center pb-[30px]'>
                Ngày sinh
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]  font-medium'>
                    <div>{data?.user?.birthday ? formatDateDDMMYYYY(data?.user?.birthday) : "Chưa cập nhật"}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-start items-center pb-[30px]'>
                Giới tính
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]  font-medium'>
                    <div>{data?.user?.gender ? data?.user?.gender : "Chưa cập nhật"}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-start items-center pb-[30px]'>
                Thời gian tạo
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]  font-medium'>
                    <div>{formatDateDDMMYYYY(data?.user?.registrationDate)}</div>
                </div>
              </div>
              <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-start items-center pb-[30px]'>
                Trạng thái
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]  font-medium'>
                    <div>{data?.user?.isActive ? "Đang hoạt động" : "Vô hiệu hoá"}</div>
                </div>
              </div>
            </div>
            <div className='flex justify-center h-full border-l w-80'>
            <div className='flex flex-col'>
              <div className=' w-36 h-36 m-auto rounded-full p-2 border-dashed border' >
                <div className='w-full h-full overflow-hidden rounded-full relative cursor-pointer' >
                  {
                    data?.user?.avatar && <Image className='object-cover w-36 h-36' alt='avatar' src={!data?.user?.avatar ? "" : data?.user?.avatar}  width='144' height={144}/>
                  }
                </div>
              </div>
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
