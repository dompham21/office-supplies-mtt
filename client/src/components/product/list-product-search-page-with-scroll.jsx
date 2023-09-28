import { fetchProducts, fetchProductsParam, test, useProductsQuery } from '@data/product/use-products.query';
import React, { Fragment, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import GridWithLoader from './grid/grid-with-loader';
import { QueryClient, useInfiniteQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { useProductsInfiniteQuery } from '@data/product/use-products-infinite.query';
import Button from '@components/ui/button';
import { useRouter } from 'next/router';
import { useProductsSearchInfiniteQuery } from '@data/product/use-product-search-infinite.query';
const ProductCard = dynamic(() => import('./product-card'));

function ListProductWithInfiniteSearchPage(props) {
    const { query } = useRouter();

    const { title, sortField, sortDirection, pageSize, showPagination, categoryIds, priceMax, priceMin} = props;
    
    const {
        data,
        isLoading: loading,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        error,
    } = useProductsSearchInfiniteQuery({
        pageSize: pageSize, 
        sortField: sortField, 
        sortDirection: sortDirection, 
        keyword: query?.keyword?.trim().replace(/\s+/g, " ") ?? '', 
        categoryIds: categoryIds,
        priceMin: priceMin,
        priceMax: priceMax
    });

   


  

    return (
    <div className='mt-6'>
        <div className='pb-1 flex flex-col justify-center border-b w-full relative mb-1 before:absolute before:-bottom-px before:w-16 before:h-1 before:bg-accent before:left-0 before:rounded-sm'>
            <h3 className=' text-2xl text-title uppercase font-medium'>{title} &quot;<span className='lowercase text-accent'>{query?.keyword ?? ''}</span>&quot;</h3>
        </div>
        <div>
            <GridWithLoader
                totalPage={data?.pages[0]?.totalPage}
                pageNo={data?.pages[0]?.pageNo}
                pageSize={pageSize}
                notFound={!loading && (data?.pages[0]?.totalPage == 0|| error)}
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
        {
            !loading && !(data?.pages[0]?.totalPage?.length == 0|| error) && data?.pages[0]?.totalPage > 1 &&
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
        }
        
    </div>
  )
}

export default ListProductWithInfiniteSearchPage