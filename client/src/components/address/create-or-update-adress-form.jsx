import React, { useEffect, useRef, useState } from 'react'
import { Modal, Rate, notification } from 'antd';
import Image from 'next/image';
import TextArea from '@components/ui/text-area';
import { useForm, Control, FieldErrors, } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Alert from '@components/ui/alert';
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


const commentFormSchema = yup.object().shape({
    name: yup
      .string()
      .required("form:error-email-required"),
    phone: yup.string().required("form:error-phone-required").max(11, "form:error-phone-max-11"),
    specificAddress: yup
        .string()
        .required("form:error-password-required"),
    isDefault: yup
        .boolean()
        .required("form:error-password-required"),
});



function SelectProvinces({
    control,
    errors,
    onChange,
    value
  }) {
    const { data, isLoading: loading } = useProvincesQuery();
    return (
      <div className="mb-5">
        <SelectInput
          id="select-province"
          name="province"  
          value={value}
          handleOnChange={onChange}
          placeholder="Tỉnh/Thành phố"
          control={control}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.code}
          options={data?.provinces}
          isLoading={loading}
        />
        <ValidationError message={errors.province?.message} />
      </div>
    );
}

function SelectDistricts({
    control,
    errors,
    onChange,
    value,
    provinceId,
  }) {
    const { data, isLoading: loading } = useDistrictsQuery(provinceId);
    return (
      <div className="mb-5">
        <SelectInput
          id="select-district"
          name="district"  
          value={value}
          handleOnChange={onChange}
          placeholder="Quận/Huyện"
          control={control}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.code}
          options={data?.districts}
          isLoading={loading}
        />
        <ValidationError message={errors.district?.message} />
      </div>
    );
}


function SelectWards({
    control,
    errors,
    onChange,
    districtId,
    value
  }) {
    const { data, isLoading: loading } = useWardsQuery(districtId);
    return (
      <div className="mb-5">
        <SelectInput
          id="select-ward"
          name="ward"  
          value={value}
          handleOnChange={onChange}
          placeholder="Phường/Xã"
          control={control}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.code}
          options={data?.wards}
          isLoading={loading}
        />
        <ValidationError message={errors.ward?.message} />
      </div>
    );
}

const defaultValues = {
    name: "",
    phone: "",
    specificAddress: "",
    province: null,
    district: null,
    ward: null,
    isDefault: false
};

function CreateOrUpdateAddressForm({initialValues}) {
    const [errorMsg, setErrorMsg] = useState("");
    const queryClient = useQueryClient();
    const [province, setProvince] = useState(initialValues?.ward?.district?.province || null);
    const [district, setDistrict] = useState(initialValues?.ward?.district || null);
    const [ward, setWard] = useState(initialValues?.ward || null);

    
    const router = useRouter()

    const { mutate: createAddress, isLoading: creating } = useCreateAddressMutation();
    const { mutate: updateAddress, isLoading: updating } = useUpdateAddressMutation();

 

    const [api, contextHolder] = notification.useNotification();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
      } = useForm({
        defaultValues: initialValues ? {
            name: initialValues?.name,
            phone:  initialValues?.phone,
            specificAddress: initialValues?.specificAddress,
            province: initialValues?.ward?.district?.province,
            district: initialValues?.ward?.district,
            ward: initialValues?.ward,
            isDefault: initialValues?.default_address
        } : defaultValues,
        resolver: yupResolver(commentFormSchema),
    });

    const onSubmit = async (values) => {


        const input = {
            name: values.name,
            phone: values.phone,
            specificAddress: values.specificAddress,
            isDefault: values.isDefault,
            wardCode: values.ward.code
        };

        if(initialValues) {
            updateAddress({
                id: initialValues?.id,
                variables: {
                    ...input
                },
            },
            {
                onSuccess: ( value ) => {
                    const response  = value.data

                    if (response) {
                        const { result, code, status, msg} = response;
                        if(result == 1) {
                          
                            toast.success('Sửa địa chỉ thành công', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            }); 

                            router.push('/user/address')
                        }
                        else if(result == 0) {
                            setErrorMsg(msg);
                            return;
                        }
                    } else {
                        toast.error('Sửa địa chỉ thất bại!', {
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
                    queryClient.invalidateQueries({ queryKey:[API_ENDPOINTS.ADDRESS, initialValues?.id?.toString()]});
                },
              
                  
            });
        }
        else {
            createAddress({
                variables: {
                    ...input
                },
            },
            {
                onSuccess: ( value ) => {
                    const response  = value.data
    
                    if (response) {
                        const { result, data, code, status, msg } = response;
                        if(result == 1) {
                            toast.success('Thêm mới địa chỉ thành công', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            }); 
                          router.push('/user/address')
     
                        }
                        else if(result == 0) {
                            setErrorMsg(msg);
                            return;
                        }
                    } else {
                        toast.error('Thêm mới địa chỉ thất bại!', {
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
        <div className='mt-4'>
            <div className='flex items-center gap-4'>
                <Input
                    placeholder="Ho va ten"
                    {...register("name")}
                    type="text"
                    variant="outline"
                    className="mb-4 flex-1"
                    error={errors?.name?.message}
                />
                <Input
                    placeholder="So dien thoai"
                    {...register("phone")}
                    type="text"
                    variant="outline"
                    className="mb-4 flex-1"
                    error={errors?.phone?.message}
                />
            </div>
            <SelectProvinces value={province} onChange={handleChangeSelectProvince} control={control} errors={errors} />
            <SelectDistricts value={district} onChange={handleChangeSelectDistrict} provinceId={province?.code} control={control} errors={errors} />
            <SelectWards value={ward} onChange={handleChangeSelectWard} districtId={district?.code} control={control} errors={errors} />
            <Input 
                {...register("specificAddress")}  
                placeholder="Dia chi cu the"  
                type="text"
                variant="outline"
                className="mb-4 flex-1"
                error={errors?.specificAddress?.message}/>
            <SwitchInput label={"Đặt làm mặc định"} name="isDefault" control={control} errors={errors}/>
            <div className='flex items-center justify-end'>
                <Button loading={creating || updating}>
                {initialValues
                    ?  "Cập nhật"
                    : "Thêm mới"}
                </Button>
            </div>
           
        </div>
        
    </form>
  )
}

export default CreateOrUpdateAddressForm