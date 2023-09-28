import GetLayoutPageUser from '@components/layouts/layout_page_user';
import OrderDetail from '@components/order/order-detail';
import Loader from '@components/ui/loaders/loader';
import NotFound from '@components/ui/not-found';
import { useOrderDetailQuery } from '@data/order/use-order-detail.query';
import { currencyMoney } from '@utils/format-currency';
import { useRouter } from 'next/router';
import React from 'react'

export default function OrderDetailPage() {
    const { query } = useRouter();

    const {
        data,
        isLoading: loading,
        error,
    } = useOrderDetailQuery(query?.id)

    if (loading) return <Loader text="Loading" />;
    if (error) return  <NotFound text="text-not-found" className="w-7/12 mx-auto" />

    return (
        <div className="min-h-screen">
            <OrderDetail order={data?.order}/>
        </div>
    )
}

OrderDetailPage.authenticate = {
    permissions: ["USER"],
};

OrderDetailPage.Layout = GetLayoutPageUser
