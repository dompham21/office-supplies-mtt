import React from 'react'
import { Swiper,SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectCoverflow, Autoplay, Navigation, Pagination } from 'swiper';
import Image from 'next/image';
import Link from 'next/link';

function SwiperCategories(props) {
    const { categories } = props
    SwiperCore.use([Navigation]);
    return (
        <Swiper
            navigation={true}
            grabCursor= {true}
        
            className="swiper-categories h-full relative pb-8"
            style={ {
                paddingBottom: "30px !important"
            }}
            slidesPerView="6"
            spaceBetween={10}
            slidesPerGroup="6"
        >
            {
                categories && categories.map(cat => (
                     <SwiperSlide  key={cat.id} className='h-full w-full border rounded-lg bg-white cursor-pointer hover:border-accent hover:shadow'>
                        <Link href={`/search?categoryIds=${cat?.id}`} scroll={false}>
                            <div className='w-full h-full flex flex-col justify-center items-center'>
                                <div className='w-full h-40 shrink flex flex-col justify-center items-center'>
                                    <div className=' w-9/12 h-full mt-3 bg-cover bg-no-repeat bg-center' style={{backgroundImage:`url(${cat?.image})`}}></div>
                                </div>
                                <div className="w-full h-13 text-center px-4 mt-2">
                                    <div className='text-sm h-10 mb-2.5 text-ellipsis line-clamp-2'>{cat?.name}</div>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))
            }       
        </Swiper>
    )
}

export default SwiperCategories