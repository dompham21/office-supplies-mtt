import React from 'react'
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import { currencyMoney } from '@utils/format-currency';
import Image from 'next/image';

function ProductCartCheckout({product, quantity}) {
  return (
    <div className='py-4 backdrop:border-b'>
        <div className='mx-[30px] flex truncate items-center min-h-[55px]'>
        <div className='text-base text-[#222] flex items-center' style={{flex: 6}}>
            <Image src={product?.images && product?.images?.length > 0  ?  product?.images[0] :  productPlaceholder} alt={product?.image || "product image"} width={40} height={40} className='h-10 w-10 object-fill'/>
            <span className='mx-4 truncate'>{product?.name}</span>
        </div>
        <div className='flex-1 text-base text-center text-[#666] capitalize'>
          {

            product?.priceAfterDiscount && product.discount ? 
              (
                  currencyMoney(product?.priceAfterDiscount) || 0
              )
              :
              currencyMoney(product?.price) || 0
          }
            
          
        </div>
        <div className='flex-1 text-base text-center text-[#666] capitalize'>{quantity}</div>
        <div className='flex-2 text-base text-right text-[#666] capitalize'>
          {
            product?.priceAfterDiscount && product.discount ? 
                (
                    currencyMoney(product?.priceAfterDiscount * quantity) || 0
                )
            :
            currencyMoney(product?.price * quantity) || 0
          }
        </div>
      </div>
    </div>
  )
}

export default ProductCartCheckout