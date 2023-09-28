import React from 'react'
import cn from 'classnames';
import Button from '@components/ui/button';
import NotFound from '@components/ui/not-found';
import { useTranslation } from 'next-i18next';
import rangeMap from '@utils/rangeMap';
import CartLoader from '@components/ui/loaders/cart-loader';
import { default as cartEmpty } from '@assets/cart-empty.png';
import Image from 'next/image';

function ListCartWithLoader({
  showLoaders,
  pageSize = 10,
  children,
  notFound,
  isEmpty,
  layout,
}) {
    if(isEmpty) {
        return (
          <div className="w-full flex flex-col justify-center items-center py-16" >
            {/* <NotFound text="Chưa có đánh giá" className="w-7/12 mx-auto" /> */}
            <Image src={cartEmpty} width={100} height={100} alt={"cart empty"}/>
            <div className='mt-4 text-base text-trans-40 font-bold'>Giỏ hàng của bạn còn trống</div>
          </div>
        )
       
    }

    if (notFound) {
        return (
          <div className="w-full min-h-full pt-6 pb-8 px-4 lg:p-8">
            <NotFound text="text-not-found" className="w-7/12 mx-auto" />
          </div>
        );
    }


    return (
        <div className='flex w-full p-6 flex-col rounded-lg border-b border-border-200 border-opacity-70'>
            {showLoaders ? (
                <>
                {rangeMap(pageSize, (i) => (
                    <CartLoader key={i} uniqueKey={`cart-${i}`} />
                ))}
                </>
            ) : (
                children
            )}
        </div>
    )
}

export default ListCartWithLoader