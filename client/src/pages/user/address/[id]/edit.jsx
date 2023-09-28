import CreateOrUpdateAddressForm from '@components/address/create-or-update-adress-form'
import GetLayoutPageUser from '@components/layouts/layout_page_user'
import Button from '@components/ui/button'
import ErrorMessage from '@components/ui/error-message'
import Loader from '@components/ui/loaders/loader'
import { useDetailAddressQuery } from '@data/address/use-detail-address.query'
import { useRouter } from 'next/router'
import React from 'react'




export default function UpdateAddressPage() {
    const { query } = useRouter();

    const {
        data,
        isLoading: loading,
        error,
    } = useDetailAddressQuery(query.id);

    if (loading) return <Loader text={"common:text-loading"} />;
    if (error) return <ErrorMessage message={error.message} />;

    return (
        <div className='flex flex-col bg-white rounded shadow-sm'>
            <div className='px-[30px] py-6 flex items-center border-b'>
                <div className='text-lg font-medium' style={{flex : 1}}>
                Địa chỉ của tôi
                </div>
            </div>
            <CreateOrUpdateAddressForm initialValues={data?.address} />
        </div>
    )
}

UpdateAddressPage.authenticate = {
    permissions: ["USER"],
};

UpdateAddressPage.Layout = GetLayoutPageUser

