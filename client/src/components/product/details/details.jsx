import React from 'react'
import { useTranslation } from 'next-i18next';
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import classNames from 'classnames';
import Image from 'next/image';
import { currencyMoney } from '@utils/format-currency';
import { formatSoldQuantity } from '@utils/format-sold-quantity';
import CategoryBadges from './category-badge';
import { AddToCart } from '../add-to-cart/add-to-cart';
import { default as avatarPlaceholder } from '@assets/placeholders/avatar.png';
import Avatar from '@components/ui/avatar';
import ReviewCard from '@components/review/review-card';
import ListReviewWithLoader from '@components/review/list-review-with-loader';
import ListReviewDetail from '@components/review/list-review-detail';
import { Rate } from 'antd';
import DetailsImages from './details-images';

function Details({product}) {
    const { 
        id,
        name,
        images,
        category,
        brand,
        price,
        soldQuantity,
        inStock,
        description,
        registrationDate,
        rate,
        discount,
        priceAfterDiscount
    } = product


    

    return (
        <article>
            <div className="flex bg-white rounded-lg  flex-col md:flex-row border-b border-border-200 border-opacity-70">
                <div className="md:w-1/2 p-6 pt-10">
                    <div className="flex items-center justify-between mb-8 lg:mb-10">
                        {discount && (
                        <div className="rounded-full text-xs leading-6 font-semibold px-3 bg-accent text-light ms-auto">
                            {discount}%
                        </div>
                        )}
                    </div>

                    <DetailsImages images={images} name={name}/>
                </div>

                <div className="flex flex-col items-start md:w-1/2 p-5 pt-10 lg:p-14 xl:p-16">
               
                <div className="w-full">
                    <h1 className='font-semibold text-lg md:text-xl xl:text-2xl tracking-tight line-clamp-2 text-ellipsis text-heading cursor-pointer transition-colors hover:text-accent'>
                        {name}
                    </h1>
                    <div className="flex flex-row mt-2.5">
                        {
                            rate ? 
                            <div className="flex items-center pr-4 border-r pr-4">
                                <Rate allowHalf defaultValue={rate} disabled/>
                                <p className="ml-2  pb-0 text-sm font-medium text-gray-500 dark:text-gray-400  mt-1">{rate} out of 5</p>
                            </div> : null
                        }
                       
                        {Number(inStock) > 0 && Number(soldQuantity) > 0 &&  (
                            <div className="mt-1">
                                Đã bán {formatSoldQuantity(soldQuantity)}
                            </div>
                        )}
                    </div>
                   
                    <div className="mt-2 md:mt-4 flex items-center">
        
                       
                        {discount && priceAfterDiscount ? (
                            <>
                                <del className="text-sm md:text-base font-normal text-muted ms-2 mr-2">
                                    {currencyMoney(price)}
                                </del>
                                <ins className="text-2xl md:text-3xl font-semibold text-accent no-underline">
                                    {currencyMoney(priceAfterDiscount)}
                                </ins>
                            </>
                           
                        )
                    
                    :

                        <ins className="text-2xl md:text-3xl font-semibold text-accent no-underline">
                            {currencyMoney(price)}
                        </ins>
                    
                    }
                    
                    </div>
                   

                    <div className="mt-10 md:mt-12 flex flex-col lg:flex-row items-center">
                        <div className="mb-3 lg:mb-0 w-full lg:max-w-[400px]">
                            <AddToCart
                                inStock={inStock}
                                data={product}
                                productId={product?.id}
                                disabled={Number(inStock) <= 0}
                            />
                        </div>
                        
                        {Number(inStock) > 0 ? (
                        <span className="text-base text-body whitespace-nowrap lg:ms-7">
                            {'Còn lại'} {inStock} 
                        </span>
                        ) : (
                        <div className="text-base text-red-500 whitespace-nowrap lg:ms-7">
                            {'Hết hàng'}
                        </div>
                        )}
                    </div>
                </div>

                {category && (
                    <CategoryBadges
                        category={category}
                    />
                )}

                {brand && brand?.name && (
                    <div className="flex items-center mt-2">
                    <span className="text-sm font-semibold text-heading capitalize me-6 py-1">
                        {'Thương hiệu'}
                    </span>

                    <button
                        onClick={() => navigate(`${ROUTES.SHOPS}/${shop?.slug}`)}
                        className="text-sm text-accent tracking-wider transition underline hover:text-accent-hover hover:no-underline"
                    >
                        {brand?.name}
                    </button>
                    </div>
                )}
                </div>
            </div>

            <div className="py-4 bg-white mt-4 rounded-lg px-8 lg:px-10 lg:py-14 border-b border-border-200 border-opacity-70">
                <div className='pb-2 flex flex-col justify-center mb-4 md:mb-6  border-b w-full relative before:absolute before:-bottom-px before:w-16 before:h-1 before:bg-accent before:left-0 before:rounded-sm'>
                    <h3 className=' text-2xl text-title uppercase font-medium'>Chi tiết sản phẩm</h3>
                </div>
                <p className="text-sm text-body">{description}</p>
            </div>

            <ListReviewDetail id={id} rate={rate}/>
        </article>
    )
}

export default Details