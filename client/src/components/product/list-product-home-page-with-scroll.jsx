import { fetchProducts, fetchProductsParam, test, useProductsQuery } from '@data/product/use-products.query';
import React, { Fragment, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import GridWithLoader from './grid/grid-with-loader';
import { QueryClient, useInfiniteQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { useProductsInfiniteQuery } from '@data/product/use-products-infinite.query';
import Button from '@components/ui/button';
const ProductCard = dynamic(() => import('./product-card'));

function ListProductWithInfiniteHomePage(props) {
    const { title, sortField, sortDirection, pageSize, showPagination } = props;
    
    const {
        data,
        isLoading: loading,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        error,
    } = useProductsInfiniteQuery({pageSize: pageSize, sortField: sortField, sortDirection: sortDirection});

    return (
    <div className='mt-6'>
        <div className='pb-1 flex flex-col justify-center border-b w-full relative mb-1 before:absolute before:-bottom-px before:w-16 before:h-1 before:bg-accent before:left-0 before:rounded-sm'>
            <h3 className=' text-2xl text-title uppercase font-medium'>{title}</h3>
        </div>
        <div>
            <GridWithLoader
                totalPage={data?.pages[0]?.totalPage}
                pageNo={data?.pages[0]?.pageNo}
                pageSize={pageSize}
                notFound={!loading && (data?.pages[0]?.totalPage?.length == 0|| error)}
                showLoaders={loading}
                >
                     {data?.pages?.map((item, idx) => (
                        <Fragment key={idx}>
                            {item?.products?.map((product) => (
                                <div key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </Fragment>
                    ))}
            </GridWithLoader>
        </div>
        <div className='flex mb-8 items-center justify-center'>
            <Button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
            >
            {isFetchingNextPage
                ? 'Đang tải thêm...'
                : hasNextPage
                ? 'Xem thêm'
                : 'Không còn gì để tải'}
            </Button>
        </div>
    </div>
  )
}

export default ListProductWithInfiniteHomePage