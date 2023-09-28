import { fetchProducts, fetchProductsParam, test, useProductsQuery } from '@data/product/use-products.query';
import React, { Fragment, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import GridWithLoader from './grid/grid-with-loader';
import { QueryClient, useInfiniteQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { useProductBestSellQuery } from '@data/product/use-product-best-sell.query';
import { useProductNewQuery } from '@data/product/use-product-new.query';
import GridSlide from './grid/grid-slider';
import { SwiperSlide, Swiper } from 'swiper/react';
const ProductCard = dynamic(() => import('./product-card'));

function ListProductWithSlider(props) {
    const { title, products, loading, error } = props;

   

    return (
    <div className='mt-6'>
        <div className='pb-1 flex flex-col justify-center border-b w-full relative mb-1 before:absolute before:-bottom-px before:w-16 before:h-1 before:bg-accent before:left-0 before:rounded-sm'>
            <h3 className=' text-2xl text-title uppercase font-medium'>{title}</h3>
        </div>
        <div>
            <GridSlide
                notFound={!loading && (products?.length == 0 || error)}
                showLoaders={loading}
                >
                    <Swiper
                        className="w-full swiper-list-product"
                        slidesPerGroup={5}
                        slidesPerView={5}
                        spaceBetween={30}
                        navigation={true}
                        allowTouchMove={false}>
                         {products?.map((product) => (
                            <SwiperSlide className="swiper-slide swiper-slide-playlist" key={product.id}>

                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                   
                   

            </GridSlide>
        </div>
    </div>
  )
}

export default ListProductWithSlider