import { usePostersQuery } from '@data/poster/use-poster.query';
import React, { useEffect } from 'react'
import PosterListRight from './poster-list-right';

import SwiperPoster from './swiper-poster';

function Poster(props) {
    const { error, data, isLoading } = usePostersQuery();
  
    if (isLoading) {
        return (
          <div className="hidden xl:block">
            <div className="w-72 mt-8 px-2">
              {/* <CategoriesLoader /> */}
              <div>Loading</div>
            </div>
          </div>
        );
    }
    return (
       <div className='mt-6 h-80 flex flex-row'>
            <div className='overflow-hidden flex-2 rounded-md'>
                <SwiperPoster items={data?.posters?.filter(i => i?.type == 1)}/>
            </div>
            <div className='flex flex-col flex-1 ml-1.5'>
                <PosterListRight items={data?.posters?.filter((i, idx) => i?.type == 2)?.splice(0, 2)}/>
            </div>
       </div>
    )
}

export default Poster