import Image from 'next/image'
import React, { useState } from 'react'
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs } from 'swiper';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

function DetailsImages({images, name}) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);


    return (
        <div className="product-gallery h-[600px]">      
            <div className="w-full h-full flex flex-col items-center justify-center">
                <Swiper
                    grabCursor= {true}
                    navigation={true}
                    centeredSlides={true}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[ Navigation, Thumbs]}
                    className="w-full h-[80%] mb-4"
                >
                    {
                        images ? images.map((image, idx) => 
                            <SwiperSlide key={idx}>
                                <div className='w-full h-full bg-contain bg-center bg-no-repeat' style={{backgroundImage:`url(${image ?? productPlaceholder})`}}/>
                            </SwiperSlide>
                        )
                        :
                        <SwiperSlide>
                             <div className="w-full h-full flex items-center justify-center">
                                <Image
                                    className='object-covert h-full'
                                    src={productPlaceholder}
                                    alt={name}
                                    width={400}
                                    height={400}
                                />
                            </div>
                        </SwiperSlide>
                    }
                </Swiper>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    modules={[Navigation, Thumbs]}
                    className="w-full h-[20%]"
                >
                    {
                        images && images.map((image, idx) => 
                        <SwiperSlide key={idx}>
                            <div className="w-full h-full flex items-center justify-center border cursor-pointer rounded overflow-hidden">
                                <Image
                                    className='object-covert h-full'
                                    src={image ?? productPlaceholder}
                                    alt={name}
                                    width={100}
                                    height={100}
                                />
                            </div>
                        </SwiperSlide>
                        )
                    }
                </Swiper>            
            </div>
        </div>
    )
}

export default DetailsImages