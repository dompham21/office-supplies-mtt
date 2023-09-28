import { useCategoriesQuery } from '@data/category/use-category.query';
import React from 'react'
import SwiperCategories from './swiper-categories'

function Categories(props) {
  
  const { error ,data, isLoading} = useCategoriesQuery();

  return (
    <div className='mt-6 flex flex-col rounded-md'>
      <div className='pb-1 flex flex-col justify-center border-b w-full relative mb-1 before:absolute before:-bottom-px before:w-16 before:h-1 before:bg-accent before:left-0 before:rounded-sm'>
        <h3 className=' text-2xl text-title uppercase font-medium'>Danh mục</h3>
      </div>
      <div className='overflow-hidden'>
        <SwiperCategories categories={data?.categories}/>
      </div>
    </div>
  )
}

export default Categories