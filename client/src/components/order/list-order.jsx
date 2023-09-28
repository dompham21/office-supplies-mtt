import { useOrdersQuery } from '@data/order/use-orders.query';
import React, { Fragment, useState } from 'react'
import ListOrderWithLoader from './list-order-with-loader';
import OrderCard from './order-card';

function ListOrder(props) {
    const { type, fromDate, toDate, keyword } = props;
    const [page, setPage] = useState(1);
   

    function handlePagination(current) {
        setPage(current);

        const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js
        if (!isBrowser()) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const params = {pageNo: page, pageSize: 10, fromDate: fromDate, toDate: toDate, keyword: keyword.trim().replace(/\s+/g, " ") ?? ''}
    const {
        data,
        isLoading: loading,
        error,
    } = useOrdersQuery(type, params);

   
      
    return (
        <Fragment>
            <ListOrderWithLoader
                totalPage={data?.totalPage}
                pageNo={data?.pageNo}
                pageSize={10}
                isEmpty={!loading && (data?.orders?.length == 0 || error)}
                showLoaders={loading}
                onPagination={handlePagination}
            >
                {data?.orders?.map((order) => (
                    <div key={order.id}>
                        <OrderCard  order={order} type={type} params={params}/>
                    </div>
                ))}
            </ListOrderWithLoader>
        </Fragment>
    )
}

export default ListOrder