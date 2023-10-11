import Input from '@components/ui/input'
import { useUpdateNameMutation } from '@data/profile/use-update-name.mutation';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import Alert from '@components/ui/alert';
import SelectInput from '@components/ui/select-input';
import ValidationError from '@components/ui/form-validation-error';
import { useProvincesQuery } from '@data/address/use-province.query';
import { useDistrictsQuery } from '@data/address/use-districts.query';
import { useWardsQuery } from '@data/address/use-ward.query';
import { concatAddress, extractAddress } from '@utils/concat-address';
import { Button, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import formatDateDDMMYYYY from '@utils/format-date-dd-mm-yyyy';
import { useProvincesDetailQuery } from '@data/address/use-province-detail.query';
import { useDistrictsDetailQuery } from '@data/address/use-districts-detail.query';
import { useWardsDetailQuery } from '@data/address/use-ward-detail.query';
import { MESSAGE_ERROR_MAP } from '@utils/message-error-map';

const defaultValues = {
    name: "",
    phone: "",
    email: "",
    district: null,
    specificAddress: null,
    ward: null,
    province: null
};
const { Option } = Select;

const profileFormSchema = yup.object().shape({
    name: yup
      .string()
      .required(MESSAGE_ERROR_MAP.NAME_NOT_BLANK)
      .max(50, MESSAGE_ERROR_MAP.NAME_MAX_LENGTH),
    specificAddress: yup
      .string()
      .trim()
      .required(MESSAGE_ERROR_MAP.SPECIFIC_ADDRESS_NOT_BLANK)
      .max(50, MESSAGE_ERROR_MAP.SPECIFIC_ADDRESS_MAX_LENGTH),
    district: yup
      .string()
      .required(MESSAGE_ERROR_MAP.DISTRICT_NOT_NULL),
    province: yup
      .string()
      .required(MESSAGE_ERROR_MAP.PROVINCE_NOT_NULL), 
    ward: yup
      .string()
      .required(MESSAGE_ERROR_MAP.WARD_NOT_NULL), 
    gender: yup.string().required(MESSAGE_ERROR_MAP.GENDER_NOT_BLANK).max(3, MESSAGE_ERROR_MAP.GENDER_MAX_LENGTH),
    birthday: yup.string().required(MESSAGE_ERROR_MAP.BIRTHDAY_NOT_NULL),
});

function SelectProvinces({
    control,
    errors,
    onChange: onchangeProvince,
    value
  }) {
    const { data, isLoading: loading } = useProvincesQuery();
    return (
      <div className="w-full">
  
        <Controller
          control={control}
          name="province"
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              id="province"
              name="province" 
              placeholder="Tỉnh/Thành phố"
              onChange={(e) => {onChange(e); onchangeProvince(e)}}
              value={value}
              size='large'
              className='w-full'
              >
              {data?.provinces.map(item => (
                <Option key={item.code} value={item.code} label={item.name}>
                  <div>
                    {item.name}
                  </div>
                </Option>
              ))}
            </Select>
          )}
        />
        <ValidationError message={errors.province?.message} />
      </div>
    );
  }
  
function SelectDistricts({
  control,
  errors,
  onChange: onchangeProvince,
  value,
  provinceId,
}) {
  const { data, isLoading: loading } = useDistrictsQuery(provinceId);
  return (
    <div className="w-full">
      <Controller
          control={control}
          name="district"
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              id="district"
              name="district" 
              placeholder="Quận/Huyện"
              onChange={(e) => {onChange(e); onchangeProvince(e)}}
              value={value}
              loading={loading}
              size='large'
              className='w-full'
              >
              {data?.districts.map(item => (
                <Option key={item.code} value={item.code} label={item.name}>
                  <div>
                    {item.name}
                  </div>
                </Option>
              ))}
            </Select>
          )}
        />
      <ValidationError message={errors.district?.message} />
    </div>
  );
}


function SelectWards({
  control,
  errors,
  onChange: onchangeProvince,
  districtId,
  value
}) {
  const { data, isLoading: loading } = useWardsQuery(districtId);
  return (
    <div className="w-full">
      <Controller
          control={control}
          name="ward"
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              id="ward"
              name="ward" 
              placeholder="Phường/Xã"
              onChange={(e) => {onChange(e); onchangeProvince(e)}}
              value={value}
              loading={loading}
              size='large'
              className='w-full'
              >
              {data?.wards.map(item => (
                <Option key={item.code} value={item.code} label={item.name}>
                  <div>
                    {item.name}
                  </div>
                </Option>
              ))}
            </Select>
          )}
        />
      <ValidationError message={errors.ward?.message} />
    </div>
  );
}
const useX = () => {
  
  const { data, error, mutate, isLoading, isSuccess } = useMutation({ mutationFn, onError, onSuccess, onSettled})


}


function ProfileUpdateInfoForm({initialValues, loading}) {
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [ward, setWard] = useState( null);
    const { mutate: updateName, isLoading: updating } = useUpdateNameMutation();
    const [errorMsg, setErrorMsg] = useState("");
    const queryClient = useQueryClient();

    const { data: provinceDetail } = useProvincesDetailQuery(province);
    const { data: districtDetail } = useDistrictsDetailQuery(district);
    const { data: wardDetail } = useWardsDetailQuery(ward);


  

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
      } = useForm({
        defaultValues: initialValues ? {
            name: initialValues?.name,
            phone:  initialValues?.phone,
            email: initialValues?.email,
            gender: initialValues?.gender ?? 'nam',
            birthday: initialValues?.birthday,
            specificAddress: null,
            ward: null,
            district: null,
            province: null
        } : defaultValues,
        resolver: yupResolver(profileFormSchema),
      });

      useEffect(() => {
        if (!loading && initialValues && initialValues?.address) {  
          const {  spec, wa, dis, prov } = extractAddress(initialValues?.address)
       
          setValue("specificAddress", spec.trim());
          setValue("province", prov.trim());
          setValue("district", dis.trim());
          setValue("ward", wa.trim());
        }
      }, [loading, initialValues, setValue, initialValues?.address]);

      const handleChangeSelectProvince = (province) => {
        if(province != null) {
              setProvince(province)
              setDistrict(null)
              setWard(null)
    
              setValue("province", province)
              setValue("district", null)
              setValue("ward", null)
  
          }
      }
    
      const handleChangeSelectDistrict = (district) => {
          if(district != null) {
              setDistrict(district)
              setWard(null)
              setValue("district", district)
              setValue("ward", null)
    
          }
      }
    
      const handleChangeSelectWard = (ward) => {
          if(ward != null) {
              setWard(ward)
              setValue("ward", ward)
          }
      }
    
      const onSubmit = async (values) => {
        const valueProvince = provinceDetail?.provinces?.name ?? values?.province
        const valueDistrict = districtDetail?.districts?.name ?? values?.district
        const valueWard = wardDetail?.wards?.name ?? values?.ward

        const input = {
            name: values.name,
            gender: values.gender,
            birthday: formatDateDDMMYYYY(values?.birthday),
            address:concatAddress(values.specificAddress?.trim(), valueWard, valueDistrict, valueProvince),
        };

        updateName({
            id: initialValues?.id,
            variables: {
                ...input
            },
        },
        {
          onSuccess: ( value ) => {
              const response  = value.data

              if (response) {
                  const { result, code, data, status, msg} = response;
                  if(result == 1) {
                      toast.success('Sửa thông tin tài khoản thành công!', {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                      }); 

                      queryClient.setQueryData(
                          [API_ENDPOINTS.ME],
                          (oldData) => oldData ? {
                            ...oldData,
                            user: data
                          } : oldData
                      )
                  }
                  else if(result == 0) {
                      setErrorMsg(msg);
                      return;
                  }
              } else {
                  toast.error('Sửa thông tin cá nhân thất bại!', {
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
            queryClient.invalidateQueries(API_ENDPOINTS.ME);
          },
      
        });
        
        
    }

  return (
    <div className='w-full'>
        <form onSubmit={handleSubmit(onSubmit)}>
            {errorMsg ? (
                <Alert
                    message={errorMsg}
                    variant="error"
                    closeable={true}
                    className="mb-5"
                    onClose={() => setErrorMsg("")}
                />
                ) : null}
            <div className='w-full flex items-cente mb-5'>
                <div className='text-[#555555cc] w-[20%] flex justify-end items-center mt-3'>
                Họ và tên
                </div>
                <div className='pl-5 flex-1'>
                    <Input  
                        type="text"
                        error={errors?.name?.message}
                        style={{fontSize: '16px'}}
                        placeholder="Nhập họ và tên"
                        {...register("name")}
                        variant="outline"/>
                </div>
            </div>
            <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-end items-center pb-[30px]'>
                Địa chỉ email
                </div>
                <div className='pl-5 flex-1 flex items-center  pb-[30px]'>
                    <div>{initialValues?.email}</div>

                </div>
            </div>
            <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-end items-center pb-[30px]'>
                Số điện thoại
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]'>
                    <div>{initialValues?.phone}</div>
                </div>
            </div>
            <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-end items-center pb-[30px]'>
                Giới tính
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]'>
                  <div className="w-full">
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Select
                          id="gender"
                          name="gender" 
                          placeholder="Chọn giới tính"
                          onChange={(e) => {onChange(e)}}
                          value={value}
                          size='large'
                          className='w-full'
                          options={[
                            {
                              value: 'nam',
                              label: 'Nam',
                            },
                            {
                              value: 'nữ',
                              label: 'Nữ',
                            },
                          ]}
                        />
                      )}
                    />
                    
                    <ValidationError message={errors.gender?.message} />
                  </div>
                </div>
            </div>
            <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-end items-center pb-[30px]'>
                Ngày sinh
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]'>
                  <Controller
                    control={control}
                    name="birthday"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <DatePicker
                        format="DD/MM/YYYY"
                        onChange={onChange}
                        onBlur={onBlur}
                        value={dayjs(value)}
                        placeholder='Chọn ngày sinh'
                        className="border border-border-base w-full h-10"
                      />
                    )}
                  />
                  <ValidationError message={(errors.startDate?.message)} />
                </div>
            </div>
            <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-end items-center pb-[30px]'>
                Tỉnh/Thành phố
                </div>
                <div className='pl-5  w-full flex-1 flex items-center pb-[30px]'>
                  <SelectProvinces value={province} onChange={handleChangeSelectProvince} control={control} errors={errors} />
                </div>
            </div>
            <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-end items-center pb-[30px]'>
                Quận/Huyện
                </div>
                <div className='pl-5  w-full flex-1 flex items-center pb-[30px]'>
                  <SelectDistricts value={district} onChange={handleChangeSelectDistrict} provinceId={province} control={control} errors={errors} />
                </div>
            </div>
            <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-end items-center pb-[30px]'>
                Phường/Xã
                </div>
                <div className='pl-5  w-full flex-1 flex items-center pb-[30px]'>
                  <SelectWards value={ward} onChange={handleChangeSelectWard} districtId={district} control={control} errors={errors} />
                </div>
            </div>
            <div className='w-full flex items-center'>
                <div className='text-[#555555cc] w-[20%] flex justify-end items-center pb-[30px]'>
                Số nhà, đường
                </div>
                <div className='pl-5  w-full flex-1 flex items-center pb-[30px]'>
                <Input 
                  {...register("specificAddress")}  
                  placeholder="Số nhà, tên đường"  
                  type="text"
                  variant="outline"
                  className="flex-1"
                  error={errors?.specificAddress?.message}/>                
                </div>
            </div>
            
            <div className='w-full flex items-center mt-5'>
                <div className='text-[#555555cc] w-[20%] flex justify-end items-center pb-[30px]'>
                </div>
                <div className='pl-5 flex-1 flex items-center pb-[30px]'>
                    <Button htmlType='submit' type='primary' loading={updating} style={{height: '40px', width: '150px'}}>Cập nhật</Button>  
                </div>
            </div>
        </form>
    </div>
  )
}

export default ProfileUpdateInfoForm