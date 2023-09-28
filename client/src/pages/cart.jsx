import getLayout from '@components/layouts/layouts'
import { useCartsQuery } from '@data/cart/use-cart.query';
import React, { useEffect, useState, useRef } from 'react'
import ListCartWithLoader from '@components/cart/list-cart-with-loader';
import CartCard from '@components/cart/cart-card';
import Input from '@components/ui/input';
import { currencyMoney } from '@utils/format-currency';
import Button from '@components/ui/button';
import { useRouter } from 'next/router';
import { CHECKED_LIST } from '@utils/constants';



export default function Cart() {
    const [listCartChecked, setListCartChecked] = useState([]);
    const [checkAll, setCheckAll] = useState(false)
    const router = useRouter();


    const {
        data,
        isLoading: loading,
        error,
      } = useCartsQuery(); 

    const handleCheckedBox = (cart, e) => {
        if(cart != null) {
            if(checkAll) {
                setCheckAll(false)
                setListCartChecked([])
            }
            else {
                if(e.target.checked) {
                   
                    setListCartChecked([...listCartChecked, cart])
                    
                    if(listCartChecked.length + 1 === data?.carts?.length) {
                        setCheckAll(true)
                    }
                }
                else if(!e.target.checked) {
                    setListCartChecked(listCartChecked.filter(item => item.id !== cart.id));
                }
            }
            
        }
    }
    

    const getTotalPrice = () => {
        if(listCartChecked != null) {
            let total = 0;
            listCartChecked?.map(item => {
                total += item.quantity  * item.product.priceAfterDiscount
            })
            return total;

        }
        else return 0
    }

    const handleChangeCartItem = (data) => {
        let foundIndex = listCartChecked.findIndex(x => x.id == data?.id);
        if(foundIndex > -1) {
            listCartChecked[foundIndex] = data;
        }
    }

    const handleChangeDeleteCartItem = (data) => {
        let foundIndex = listCartChecked.findIndex((obj) => obj.id === data?.id);

        if (foundIndex > -1) {
            listCartChecked.splice(foundIndex, 1);
        }
    }

    const handleCheckedAll = (e) => {
        if(e.target.checked) {
            setCheckAll(true)
            setListCartChecked(data?.carts)
        }
        else {
            setCheckAll(false)
            setListCartChecked([])
        }
    }

    const handleClickBuy = () => {
        if(listCartChecked?.length > 0) {
            sessionStorage.setItem(CHECKED_LIST, JSON.stringify(listCartChecked))
            router.push({
                pathname: "/checkout",
            })
        }
    }

    return (
        <div className="lg:mx-14  mt-10 xl:mx-20 min-h-screen">
            <ListCartWithLoader                
                notFound={!loading && error}
                isEmpty={!loading && data?.carts?.length == 0}
                showLoaders={loading}
            >
                <div className='flex items-center h-14 px-5 bg-white rounded overflow-hidden shadow-sm mb-3'>
                    <div className='flex w-14 pl-3 pr-5'>
                        <input id="default-checkbox" type="checkbox" checked={checkAll} onChange={handleCheckedAll} className="w-4 h-4 text-accent bg-gray-100 border-gray-300 rounded"/>
                    </div>
                    <div className='w-[46%] flex items-center '>
                        Sản phẩm
                    </div>
                    <div className='w-[15.88022%] text-center'>Đơn giá</div>
                    <div className='w-[15.4265%] text-center'>Số lượng</div>
                    <div className='w-[10.43557%] text-center'>Số tiền</div>
                    <div className='w-[12%] text-center'>Thao tác</div>
                </div>
                {
                    data?.carts?.map((cart) => (
                        <div key={cart.id}>
                            <CartCard cart={cart} checkAll={checkAll} onChangeCartItem={handleChangeCartItem} onDeleteCartItem={handleChangeDeleteCartItem} onCheckedBox={handleCheckedBox}/>
                        </div>
                       
                ))}
               
                <div className='flex justify-end items-center py-3 bg-white rounded overflow-hidden shadow-sm mb-3'>
                    <div>Tổng cộng ({listCartChecked?.length} Sản phẩm):</div>
                    <div> 
                        <ins className="ml-2 text-2xl font-semibold text-accent no-underline">
                            {currencyMoney(getTotalPrice())}
                        </ins>
                    </div>
                    <div className='mx-3'>
                        <Button className="px-8" onClick={handleClickBuy}>Mua Hàng</Button>
                    </div>
                </div>
            </ListCartWithLoader>
         </div>
    )
}

Cart.authenticate = {
    permissions: ["USER"],
};

Cart.Layout = getLayout;

