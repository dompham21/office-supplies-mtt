// import { cartAnimation } from '@lib/cart-animation';
// import { useCart } from '@store/quick-cart/cart.context';
// import { generateCartItem } from '@store/quick-cart/generate-cart-item';
import Counter from './counter';
import AddToCartBtn from './add-to-cart-btn';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import Input from '@components/ui/input';
import { useState } from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from '@components/ui/button';
import { useAddToCartMutation } from '@data/cart/use-add-to-cart.mutation';
import { useQueryClient } from "react-query";
import { API_ENDPOINTS } from '@utils/api/endpoints';
import Swal from 'sweetalert2'
import InputNumberOnly from '@components/ui/input-number';
import { toast } from 'react-toastify';
import { useProfileQuery } from '@data/profile/use-profile.query';
import { useRouter } from 'next/router';



const defaultValues = {
  quantity: 1,
};


export const AddToCart = ({
  productId,
  inStock,
  counterClass,
  disabled,
}) => {

  const {
    data: dataProfile, isLoading: loadingProfile
  } = useProfileQuery();

  const history = useRouter()

  const { mutate: addToCart, isLoading: loading } = useAddToCartMutation();
  const queryClient = useQueryClient();
  const cartFormSchema = yup.object().shape({
    quantity: yup
      .number("Số lượng phải là number")
      .min(1, "Số lượng phải lớn hơn 1")
      .max(inStock, "Số lượng phải bé hơn hoặc bằng " + inStock)
      .required("Vui lòng nhập số lượng"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(cartFormSchema),
  });

  const fieldQuantity = register("quantity");
  const onIncrement = (e) => {
    const quantity = Number(getValues("quantity")); // "test-input"
  
    if(quantity >= inStock) {
      return;
    }
    setValue("quantity", quantity + 1);
  }

  const onDecrement = (e) => {
    const quantity = Number(getValues("quantity")); // "test-input"
    if(quantity > 1) {
      setValue("quantity", quantity - 1);
    }
    
  }
  function onSubmit({ quantity }) {
    if(!loadingProfile && !dataProfile?.user) {
      history.push('/login')
    }
    else {
      addToCart(
        {
        variables: {
          quantity,
          id: productId
        },
        },
        {
        onSuccess: ( value ) => {
            const response  = value.data
            console.log(response);

            if (response) {
                const { result, data, code, status, msg, refreshToken, accessToken } = response;
                if(result == 1 && data != null) {
                   const {id, product, quantity} = data;
                   Swal.fire({
                    width:'350',
                    icon: 'success',
                    padding:'1rem',
                    color: 'white',
                    text: 'Sản phẩm đã được thêm vào Giỏ Hàng thành công!',
                    background: '#000000b3',
                    backdrop: 'transparent',
                    showConfirmButton: false,
                    timer: 1300
                  })
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
                    return;
                }
            } else {
              toast.error("Thêm sản phẩm vào giỏ hàng thất bại!", {
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
    );
    }
   
  }


  return  (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          className={'w-52 h-14 inline-flex justify-between'}
        >
           
          <button
            type='button'
            onClick={onDecrement}
            className='flex items-center justify-center cursor-pointer rounded-tl rounded-bl p-2 transition-colors duration-200 border border-r-0 focus:outline-none px-5'
          >
            <AiOutlineMinus className="h-4 w-4 md:h-4.5 md:w-4.5 stroke-2.5" />
          </button>
          <InputNumberOnly className="border add-to-cart-input rounded-none mb-0 px-4  text-center flex items-center w-full appearance-none transition duration-300 ease-in-out text-heading text-base focus:outline-none focus:ring-0"
            control={control} name="quantity" format={true} min={1} max={inStock}/>
          <button
            type='button'
            onClick={onIncrement}
            className='flex items-center justify-center cursor-pointer border border-l-0 rounded-tr rounded-br p-2 transition-colors duration-200 focus:outline-none  px-5'
          >
            <AiOutlinePlus className="h-4 w-4 md:h-4.5 md:w-4.5 stroke-2.5" />
          </button>
        </div>
        
        <AddToCartBtn
          className="mt-3"
          loading={false}
          disabled={disabled || false}
        />
      </form>  
    </div>
  )
};
