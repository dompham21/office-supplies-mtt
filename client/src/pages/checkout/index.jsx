import getLayout from '@components/layouts/layouts'
import AddressLoader from '@components/ui/loaders/address-loader'
import { useAddressesQuery } from '@data/address/use-address.query'
import { CHECKED_LIST } from '@utils/constants'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSessionStorage from 'src/hook/useSessionStorage'
import { Alert, Modal, Radio, Select, Steps } from 'antd';
import AddressCheckout from '@components/address/address-checkout'
import ModalAddressWithLoader from '@components/address/modal-address-with-loader'
import { AiOutlinePlus } from 'react-icons/ai'
import Button from '@components/ui/button'
import Image from 'next/image'
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import { currencyMoney } from '@utils/format-currency'
import ProductCartCheckout from '@components/product/product-card-checkout'
import { useCheckoutMutation } from '@data/checkout/use-checkout.mutation'
import { useQueryClient } from 'react-query'
import { API_ENDPOINTS } from '@utils/api/endpoints'
import { Empty, notification, Space } from 'antd';
import { toast } from 'react-toastify'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import convertToUSD from '@utils/convert-vnd-to-usd'
import CreateOrUpdateAddressForm from '@components/address/create-or-update-adress-form'
import SelectInput from '@components/ui/select-input'
import ValidationError from '@components/ui/form-validation-error'
import * as yup from "yup";
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { useDistrictsQuery } from '@data/address/use-districts.query';
import { useWardsQuery } from '@data/address/use-ward.query';
import { useProvincesQuery } from '@data/address/use-province.query';
import Input from '@components/ui/input'
import { concatAddress, extractAddress } from '@utils/concat-address'
import { useProfileQuery } from '@data/profile/use-profile.query'
import { useProvincesDetailQuery } from '@data/address/use-province-detail.query'
import { useDistrictsDetailQuery } from '@data/address/use-districts-detail.query'
import { useWardsDetailQuery } from '@data/address/use-ward-detail.query'



const checkoutFormSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .matches(/^[^\-\!\[\]\{\}\"\'\>\<\%\^\*\?\/\\\|\,\`\;\:\+\=\(\)\@\$\&\!\.\#\_0-9]*$/g, 
    "Tên người nhận chỉ bao gồm chữ!")
    .required("Vui lòng điền tên người nhận!")
    .max(50, "Họ và tên người nhận tối đa 50 ký tự!"),
  phone: yup.string().required("Vui lòng điền số điện thoại người nhận!")
  .trim()
  .matches(/^((\+84|84|0)?((3[2-9]|5[25689]|7[0|6-9]|8[0-9]|9[0-4|6-9]|2[0-9])|(12[0-9]|16[2-9]|18[68]|199)))([0-9]{7})$/g, "Không đúng định dạng số điện thoại Việt Nam"),
  specificAddress: yup
      .string()
      .trim()
      .required("Vui lòng điền số nhà, tên đường nhận hàng!")
      .max(50, "Số nhà, tên đường tối đa 50 ký tự!"),
  district: yup
      .string()
      .required("Vui lòng chọn quận/huyện nhận hàng!"),
  province: yup
      .string()
      .required("Vui lòng chọn tỉnh/thành phố nhận hàng!"), 
  ward: yup
      .string()
      .required("Vui lòng chọn phường/xã nhận hàng!"), 
});

const { Option } = Select;


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

export default function Checkout() {
  const [errorMsg, setErrorMsg] = useState("");

  const [checkedListCart, setCheckedListCart] = useState([]);
  const [orderId, setOrderId] = useState(null);

  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState( null);

  const { data: provinceDetail } = useProvincesDetailQuery(province);
  const { data: districtDetail } = useDistrictsDetailQuery(district);
  const { data: wardDetail } = useWardsDetailQuery(ward);

  const queryClient = useQueryClient();
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter()
  const { data, isLoading: loading, error } = useProfileQuery();

  const defaultValues = {
    name: data?.user?.name ?? "",
    phone: data?.user?.phone ?? "",
    specificAddress: "",
    province: null,
    district: null,
    ward: null,
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkoutFormSchema),
});

  useEffect(() => {
    if (!loading && data) {
      setValue("name", defaultValues?.name?.trim());
      setValue("phone", defaultValues?.phone?.trim());
  
      if(data?.user?.address) {
        const {  spec, wa, dis, prov } = extractAddress(data?.user?.address)
       
        setValue("specificAddress", spec.trim());
        setValue("province", prov.trim());
        setValue("district", dis.trim());
        setValue("ward", wa.trim());
      }
     
    }
  }, [loading, data, setValue]);

  useEffect(() => {
    if(sessionStorage.getItem(CHECKED_LIST)) {
      setCheckedListCart(JSON.parse(sessionStorage.getItem(CHECKED_LIST)))
    }
  }, [])
  

  const { mutate: checkout, isLoading: isLoadingCheckout } = useCheckoutMutation();


  const getTotalPrice = () => {
    if(checkedListCart != null) {
      let total = 0;
      checkedListCart?.map(item => {
        if(item?.product?.priceAfterDiscount && item?.product?.discount) {
          total += item?.quantity * item?.product?.priceAfterDiscount 

        }
        else {
          total += item?.quantity * item?.product?.price 
        }

      })
      return total;

    }
    else return 0
  }

  const onSubmit = async (values) => {
    if(checkedListCart == null) {
      // Thong bao
      toast.error("Hãy chọn sản phẩm để đặt hàng!", {
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
      const valueProvince = provinceDetail?.provinces?.name ?? values?.province
      const valueDistrict = districtDetail?.districts?.name ?? values?.district
      const valueWard = wardDetail?.wards?.name ?? values?.ward

      const input = {
        name: values.name?.trim(),
        phone: values.phone?.trim(),
        address:concatAddress(values.specificAddress?.trim(), valueWard, valueDistrict, valueProvince),
        carts: checkedListCart
      };

      checkout(
        {
          variables: input
        },
        {
          onSuccess: ( value ) => {
              const response  = value.data

              if (response) {
                  const { result, code, status, msg } = response;
                  if(result == 1) {
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
                    window.open(response.data, "_self");

                    sessionStorage.removeItem(CHECKED_LIST)
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
                toast.error('Đặt hàng thất bại!', {
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
    <form onSubmit={handleSubmit(onSubmit)} className="lg:mx-14  mt-10 xl:mx-20 min-h-screen">
        {contextHolder}

       {errorMsg ? (
        <Alert
            message={t(errorMsg)}
            variant="error"
            closeable={true}
            className="mb-5"
            onClose={() => setErrorMsg("")}
        />
        ) : null}
      <div className='py-7 px-[30px] bg-white rounded shadow-sm mb-3 flex flex-col'>
        <div className='flex items-center text-lg text-accent capitalize'>
         Địa Chỉ Nhận Hàng
        </div>
        <div className='mt-2'>
            <div className='flex items-start gap-4'>
                <Input
                    placeholder="Họ và tên"
                    {...register("name")}
                    type="text"
                    variant="outline"
                    className="mb-4 flex-1"
                    error={errors?.name?.message}
                />
                <Input
                    placeholder="Số điện thoại"
                    {...register("phone")}
                    type="text"
                    variant="outline"
                    className="mb-4 flex-1"
                    error={errors?.phone?.message}
                />
            </div>
            <SelectProvinces value={province} onChange={handleChangeSelectProvince} control={control} errors={errors} />
            <SelectDistricts value={district} onChange={handleChangeSelectDistrict} provinceId={province} control={control} errors={errors} />
            <SelectWards value={ward} onChange={handleChangeSelectWard} districtId={district} control={control} errors={errors} />
            <Input 
                {...register("specificAddress")}  
                placeholder="Số nhà, tên đường"  
                type="text"
                variant="outline"
                className="mb-4 flex-1"
                error={errors?.specificAddress?.message}/>
       
        </div>
        
      </div>
      <div className='bg-white rounded overflow-hidden shadow-sm mb-3 flex flex-col'>
        <div className='px-[30px] pt-6 flex w-full'>
          <div className='text-lg text-[#222]' style={{flex: 6}}>Sản Phẩm</div>
          <div className='flex-1 text-base text-center text-[#666] capitalize'>Đơn Giá</div>
          <div className='flex-1 text-base text-center text-[#666] capitalize'>Số Lượng</div>
          <div className='flex-2 text-base text-right text-[#666] capitalize'>Thành Tiền</div>
        </div>
        {
          checkedListCart && checkedListCart?.length > 0 ? (
            <>
              {
                checkedListCart?.map(cart => (
                  <ProductCartCheckout key={cart?.id} product={cart?.product} quantity={cart?.quantity}/>
                )) 
              }
              <div className='px-[30px] pt-4 pb-5 flex justify-end items-center'>
                <div className='flex items-center'>
                  <div className='text-[#666]'>Tổng số tiền ({checkedListCart?.length} sản phẩm):</div>
                  <div className='text-xl text-accent ml-5'>{currencyMoney(getTotalPrice())}</div>
                </div>
              </div>
            </>
          )
          
           :
          <div className='py-4'><Empty/></div>
        }
       
      </div>
      <div className='bg-white rounded overflow-hidden shadow-sm mb-3 flex flex-col'>
        <div className='border-y pt-4 flex justify-end'>
          <div className='flex flex-col items-center'>
            <div className='min-h-[40px] flex items-center'>Tổng tiền hàng:</div>
            <div className='min-h-[40px] flex items-center'>Tổng thanh toán:</div>
          </div>
          <div className='flex flex-col items-center ml-4'>
            <div className='pr-5 pl-2.5 min-h-[40px] w-full flex  items-center justify-end'>{currencyMoney(getTotalPrice())}</div>
            <div className='pr-5 pl-2.5 min-h-[40px] w-full flex items-center justify-end text-2xl font-bold text-accent'>{currencyMoney(getTotalPrice())}</div>
          </div>
        </div>
        
        <div className='flex items-center justify-end'>
          <div className='min-h-[95px] flex items-center justify-end px-[30px]'>
            <Button className='w-52' style={{height: '2.75rem'}} loading={isLoadingCheckout}>Đặt hàng</Button>
          </div>
        </div>
      </div>
    </form>
  )
}


Checkout.authenticate = {
  permissions: ["USER"],
};

Checkout.Layout = getLayout;
