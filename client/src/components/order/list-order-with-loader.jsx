import OrderLoader from '@components/ui/loaders/order-loader';
import Pagination from '@components/ui/pagination';
import { useOrdersQuery } from '@data/order/use-orders.query';
import Image from 'next/image';
import React, { useState } from 'react'
import { default as emptyOrder } from '@assets/order-empty.png';
import rangeMap from '@utils/rangeMap';

function ListOrderWithLoader({ totalPage, pageSize, isEmpty, showLoaders, pageNo, children, onPagination }) {
    if (isEmpty) {
        return (
          <div className="w-full h-[600px] bg-white rounded shadow-sm mt-4 flex items-center justify-center">
            <div className='flex flex-col items-center'>
                <Image src={emptyOrder}  alt="Order empty" width={100} height={100} className='w-[100px] h-[100px] object-cover'/>
                <div className='mt-5 text-lg'>Chưa có đơn hàng</div>
            </div>
          </div>
        );
    }
  
  return (
    <div>
        <>
            {showLoaders ? (
            <div className='mt-4'>
                {rangeMap(3, (i) => (
                    <div className='mt-5'  key={i} >
                        <OrderLoader uniqueKey={`order-${i}`} />
                    </div>
                ))}
            </div>
            ) : (
                children
            )}
        </>
       { totalPage && totalPage > 1 && (
        <div className="flex justify-end items-center">
          <Pagination
            total={totalPage * pageSize}
            current={pageNo}
            pageSize={pageSize}
            onChange={onPagination}
            showLessItems
          />
        </div>
      )}
    </div>
  )
}

export default ListOrderWithLoader