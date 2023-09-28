import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import { currencyMoney } from '@utils/format-currency';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { useAddToCartMutation } from '@data/cart/use-add-to-cart.mutation';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from 'react-query';
import Swal from 'sweetalert2'
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { useDeleteCartMutation } from '@data/cart/use-delete-cart.mutation';
import { toast } from 'react-toastify';
import { useUpdateToCartMutation } from '@data/cart/use-update-to-cart.mutation';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';


function CartCard({cart, onCheckedBox, onChangeCartItem, onDeleteCartItem, checkAll}) {
    const {id, product, quantity} = cart;
    const refForInput = useRef();
    const { confirm } = Modal;

    const { mutate: addToCart, isLoading: loading } = useUpdateToCartMutation();
    const { mutate: deleteCart, isLoading: loadingDeleteCart } = useDeleteCartMutation();

    const queryClient = useQueryClient();

    const [quantityChange, setQuantityChange] = useState(quantity);


    useEffect(() => {
        if(checkAll) {
            refForInput.current.checked = true
        }
        else {
            refForInput.current.checked = false
        }
        // refForInput?.current.cheked
    }, [checkAll])
    
    const onIncrement = (e) => {
        const inStock = product?.inStock;

        if(quantityChange + 1 <= inStock) {
            setQuantityChange(quantityChange + 1);
            onSubmit(parseInt(quantityChange + 1))
        }
       
    }
    
    const onDecrement = (e) => {
       
        if(quantityChange > 1) {
            setQuantityChange(quantityChange - 1);
            onSubmit(parseInt(quantityChange - 1))
        }
    }

    function onSubmit(quantity) {
        addToCart(
            {
            variables: {
              quantity : quantity,
              id: product.id
            },
            },
            {
            onSuccess: ( value ) => {
                const response  = value.data
    
                if (response) {
                    const { result, data, code, status, msg } = response;
                    if(result == 1 && data != null) {
                       const {id, product, quantity} = data;
                       onChangeCartItem(data)
                    }
                    else if(result == 0) {
                        return;
                    }
                } else {
                    toast.error('Thêm giỏ hàng thất bại!', {
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

    function onDeleteCart(id) {
        confirm({
            title: 'Bạn có muốn xoá sản phẩm này ra khỏi giỏ hàng không?',
            icon: <ExclamationCircleFilled />,
            centered: true,
            onOk() {
                deleteCart({
                    variables: {
                        id: id
                    },
                },
                {
                onSuccess: ( value ) => {
                    const response  = value.data
        
                    if (response) {
                        const { result, data, code, status, msg } = response;
                        if(result == 1 && data != null) {
                            onDeleteCartItem(data)
                        }
                        else if(result == 0) {
                            return;
                        }
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
                    
                });
            },
            okText: "Có",
            cancelText: "Không"
        });

        
    }

    const handleChangeQuantity = (e) => {
    
        let value = e.target.value;
        if (/^\d*$/.test(value) || e.keyCode === 8 || e.keyCode === 13) {
            // Do not allow leading zeros
            if (value === "" || value.charAt(0) !== "0") {
              setQuantityChange(value);
            }
        }
    }

    const handleOnBlur = (e) => {
        const inStock = product?.inStock;

        let value = e.target.value;
        if(value === "") {
            setQuantityChange(parseInt(1));
            onSubmit(1)
        }
        else if(parseInt(value) >= inStock ) {
            setQuantityChange(parseInt(inStock));
            onSubmit(inStock)
        }
        else {
            onSubmit(parseInt(value))
        }

    }

    const handleDeleteCart = () => {
        onDeleteCart(id);
    }

    const handleCheckedBox = (cart,e) => {

        onCheckedBox(cart, e)
    }

    

    return (
        <div className='flex items-center bg-white rounded overflow-hidden shadow-sm mb-3 px-5 pb-5 pt-[15px]'>
            <div className='flex w-14 pl-3 pr-5'>
                <input id="default-checkbox" ref={refForInput} type="checkbox" onChange={(e) => handleCheckedBox(cart, e)} value="" className="w-4 h-4 text-accent bg-gray-100 border-gray-300 rounded"/>
            </div>
            <div className='w-[46%] flex'>
                <div className='w-20 h-20 flex-shrink-0'>
                    <Image className='h-full object-cover' src={product?.images && product?.images?.length > 0?  product?.images[0]: productPlaceholder} alt={product?.name||"product name"} loading="eager" width={80} height={80} />
                </div>
                <div className='ml-2.5 mr-5 flex'>
                    <h2 className='line-clamp-2 text-ellipsis'>{product?.name}</h2>
                </div>
            </div>
            <div className='w-[15.88022%] text-center break-words'> 
                {
                    product?.priceAfterDiscount && product?.discount ? (
                        <>
                            <del className="text-sm font-normal text-muted ms-2">
                            {currencyMoney(product?.price)}
                            </del>
                            <ins className="ml-2 text-sm font-semibold text-black no-underline">
                                {currencyMoney(product?.priceAfterDiscount)}
                            </ins>
                        </>
                    )
                    :
                    <ins className="ml-2 text-sm font-semibold text-black no-underline">
                        {currencyMoney(product?.price)}
                    </ins>
                }
                
            </div>
            <div className='w-[15.4265%] text-center'>
                <form noValidate className=' flex justify-center'>
                    <button
                        type='button'
                        onClick={onDecrement}
                        className='flex items-center justify-center cursor-pointer rounded-tl rounded-bl p-2 transition-colors duration-200 border border-r-0 focus:outline-none px-2'
                    >
                        <AiOutlineMinus className="h-4 w-4 md:h-4.5 md:w-4.5 stroke-2.5" />
                    </button>
                    <input
                        type="text"
                        className="border text-center flex items-center w-12 appearance-none transition duration-300 ease-in-out text-heading text-base focus:outline-none focus:ring-0"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        value={quantityChange}
                        onBlur={(e) => handleOnBlur(e)}
                        onChange={(e) => handleChangeQuantity(e)}
                    />
                    <button
                        type='button'
                        onClick={onIncrement}
                        className='flex items-center justify-center cursor-pointer border border-l-0 rounded-tr rounded-br p-2 transition-colors duration-200 focus:outline-none  px-2'
                    >
                        <AiOutlinePlus className="h-4 w-4 md:h-4.5 md:w-4.5 stroke-2.5" />
                    </button>
                </form>
            </div>
            
            <div className='w-[10.43557%] text-center'>
                <ins className="ml-2 text-sm font-semibold text-accent no-underline">
                    {
                        product?.priceAfterDiscount && product.discount ? 
                            (
                                currencyMoney(product?.priceAfterDiscount * quantity)
                            )
                        :
                        currencyMoney(product?.price * quantity)
                    }
                
                </ins>
            </div>
            <div className='w-[12%] flex items-center justify-center text-center'>
                <h3 className='cursor-pointer hover:text-accent' onClick={handleDeleteCart}>Xoá</h3>
            </div>
        </div>
    )
}

export default CartCard