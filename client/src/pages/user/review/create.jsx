import CreateOrUpdateAddressForm from '@components/address/create-or-update-adress-form'
import GetLayoutPageUser from '@components/layouts/layout_page_user'
import CreateOrUpdateReviewForm from '@components/review/create-or-update-review-form'
import Button from '@components/ui/button'
import ErrorMessage from '@components/ui/error-message'
import Loader from '@components/ui/loaders/loader'
import { useDetailAddressQuery } from '@data/address/use-detail-address.query'
import { useRouter } from 'next/router'
import React from 'react'




export default function CreateReviewPage() {
    return (
        <div className='flex flex-col bg-white rounded shadow-sm'>
            <div className='px-[30px] py-6 flex items-center border-b'>
                <div className='text-lg font-medium' style={{flex : 1}}>
                Thêm mới đánh giá
                </div>
            </div>
            <CreateOrUpdateReviewForm />
        </div>
    )
}

CreateReviewPage.authenticate = {
    permissions: ["USER"],
};

CreateReviewPage.Layout = GetLayoutPageUser

