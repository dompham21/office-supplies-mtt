import { fetchProducts, fetchProductsParam, test, useProductsQuery } from '@data/product/use-products.query';
import React, { Fragment, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import GridWithLoader from './grid/grid-with-loader';
import { QueryClient, useInfiniteQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@utils/api/endpoints';
const ProductCard = dynamic(() => import('./product-card'));

function ListProductHomePage(props) {
    const { title, sortField, sortDirection, pageSize, showPagination } = props;
    const [page, setPage] = useState(1);



    const {
        data,
        isLoading: loading,
        error,
    } = useProductsQuery({pageNo: page, pageSize: pageSize, sortField: sortField, sortDirection: sortDirection});


    function handlePagination(current) {
        setPage(current);
    }

    return (
    <div className='mt-6'>
        <div className='pb-1 flex flex-col justify-center border-b w-full relative mb-1 before:absolute before:-bottom-px before:w-16 before:h-1 before:bg-accent before:left-0 before:rounded-sm'>
            <h3 className=' text-2xl text-title uppercase font-medium'>{title}</h3>
        </div>
        <div>
            <GridWithLoader
                totalPage={data?.totalPage}
                pageNo={data?.pageNo}
                pageSize={pageSize}
                showPagination={showPagination}
                onPagination={handlePagination}
                notFound={!loading && (data?.totalPage?.length == 0|| error)}
                showLoaders={loading}
                >
                    {data?.products?.map((product) => (
                        <div key={product.id}>
                            <ProductCard product={product} />
                        </div>
                       
                    ))}
            </GridWithLoader>
        </div>
    </div>
  )
}

export default ListProductHomePage