import React, { Fragment, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { QueryClient, useInfiniteQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import ListReviewWithLoader from './list-review-with-loader';
import { useReviewsQuery } from '@data/review/use-review-by-product.query';
import { Rate } from 'antd';
import ReviewCard from './review-card';


function ListReviewDetail(props) {
    const { id, rate } = props;
    const [page, setPage] = useState(1);

    const {
        data,
        isLoading: loading,
        error,
    } = useReviewsQuery({pageNo: page, pageSize: 10, sortField: "date", sortDirection: "desc"}, id);

    function handlePagination(current) {
        setPage(current);
    }


    return (
        <div className='flex flex-col py-4 bg-white px-8 lg:px-10 rounded-lg my-4 lg:py-14 border-b border-border-200 border-opacity-70'>
            <div className='pb-2 flex flex-col justify-center mb-4 md:mb-6  border-b w-full relative before:absolute before:-bottom-px before:w-16 before:h-1 before:bg-accent before:left-0 before:rounded-sm'>
                <h3 className=' text-2xl text-title uppercase font-medium'>ĐÁNH GIÁ SẢN PHẨM</h3>
            </div>
            {
                rate ? 
                <div className="flex flex-col mb-4 p-8 bg-pink-light border border-pink-light">
                    <div className='w-fit flex flex-col items-center'>
                        <p className="text-xl font-medium text-red-star">{rate} out of 5</p>
                        <Rate allowHalf defaultValue={rate} disabled/>
                    </div>
                </div>
             : null 
             }

            <div className="mt-10">
                <ListReviewWithLoader
                    totalPage={data?.totalPage}
                    pageNo={data?.pageNo}
                    pageSize={10}
                    showPagination={true}
                    onPagination={handlePagination}
                    notFound={!loading && (data?.totalPage?.length == 0 || error)}
                    isEmpty={Boolean(!loading && data?.totalPage == 0)}
                    showLoaders={loading}
                >
                    {data?.reviews?.map((review) => (
                        <ReviewCard review={review} key={review.id}/>
                    ))}
                </ListReviewWithLoader>
            </div>      
        </div>
    )
}

export default ListReviewDetail