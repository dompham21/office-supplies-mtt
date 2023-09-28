import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Avatar from '@components/ui/avatar';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { siteSettings } from '@settings/site.settings';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Badge from '@components/ui/badge';
import { useCartsQuery } from '@data/cart/use-cart.query';
import Image from 'next/image';
import { currencyMoney } from '@utils/format-currency';
import Button from '@components/ui/button';
import { default as cartEmpty } from '@assets/cart-empty.png';
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import { Popover } from 'antd';

export default function CartMenu() {
  const {
    data,
    isLoading: loading,
    error,
  } = useCartsQuery();  

  const router = useRouter();
  const { t } = useTranslation();



  const handleClickViewCart = () => {
    router.push("/cart")
  }
 
  const content = (
    <div className="relative m-0 px-1 py-1">
      {
          !loading && (data?.carts?.length == 0 || error) && (
          <div className='flex py-8 flex-col justify-center items-center'>
            <Image src={cartEmpty} alt="cart empty" width={100} height={100}/>
            <div className='text-sm mt-2'>Chưa Có Sản Phẩm</div>
          </div>
          )
      }
      <ul className='m-0 max-h-96 w-96 overflow-hidden overflow-y-auto'>
        {data?.carts && data?.carts?.length > 0 && data?.carts?.map((cart) => (
          <li key={cart?.id}>
            <div className='flex gap-2 rounded cursor-pointer p-4 text-sm text-start font-semibold capitalize text-heading transition duration-200 hover:text-accent hover:bg-gray-100 focus:outline-none'>
              <Image src={cart?.product?.images && cart?.product?.images?.length > 0 ? cart?.product?.images[0]:  productPlaceholder} width={40} alt={cart.product.name} height={40} className="border rounded-sm"/>
              <div className='flex flex-col'>
                <div className='max-w-[320px] truncate'>{cart.product.name}</div>
                <div className='flex gap-1'>
                  <div className='text-accent'>
                    {cart?.product?.priceAfterDiscount && cart?.product?.discount ? currencyMoney(cart?.product?.priceAfterDiscount): currencyMoney(cart?.product?.price)}
                  </div>
                  <div>X{cart?.quantity}</div>
                 
                </div>
              </div>
              
            </div>
          </li>
        ))}
      </ul>
      <div className='flex py-1 justify-end border-t'>
        <Button onClick={handleClickViewCart} size="small" className="text-sm"><span>Xem giỏ hàng</span></Button>
      </div>
    </div>
  )
 

  return (
    <div className="relative inline-block text-left" onClick={handleClickViewCart}>
      <Popover content={content} trigger="hover" placement="bottomRight">
        <div className="relative flex items-center z-40 focus:outline-none cursor-pointer">
          <span className="flex items-center  text-3xl">
            <AiOutlineShoppingCart />
          </span>
          {
            data && data && data?.carts && data?.carts?.length > 0 && 
            <Badge color={"bg-accent"} textColor={"text-white"} text={data?.carts?.length} className="absolute -top-4 -right-4 px-2.5"/>
          }
        </div>
      </Popover>
      
      <div className="z-10 hidden top-5 absolute max-h-96 w-96 overflow-hidden overflow-y-auto mt-2 divide-y divide-gray-100 ring-1 ring-black ring-opacity-5 origin-top-end right-0 bg-white rounded border outline-none focus:outline-none group-hover:block">
        
      </div>
    </div>
  );
}
