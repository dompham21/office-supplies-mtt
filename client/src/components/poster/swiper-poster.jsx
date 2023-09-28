import React from 'react'
import { Swiper,SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectCoverflow, Autoplay, Navigation, Pagination } from 'swiper';



function SwiperPoster(props) {
    const { items } = props
    SwiperCore.use([Navigation,EffectCoverflow,Autoplay, Pagination]);
    return (
        <Swiper
            pagination={true}
            navigation={true}
            style={{
                "--swiper-navigation-size": "33px",
            }}
            grabCursor= {true}
            className="swiper-poster h-full"
            speed={1000}
            centeredSlides={true}
            slidesPerView="1"
            loop={true}
            autoplay={{
                delay:50000,
                disableOnInteraction:false
            }}
            
        >
            {
                items && items.map(item => (
                    <SwiperSlide key={item.id}>
                        <div className='w-full h-full bg-cover bg-no-repeat' style={{backgroundImage:`url(${item?.image})`}}/>
                    </SwiperSlide>
                ))
            }
        </Swiper>
    )
}

export default SwiperPoster