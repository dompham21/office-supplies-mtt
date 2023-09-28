import GetLayoutPageUser from '@components/layouts/layout_page_user'
import ProfileUpdateForm from '@components/profile/profile-update-form';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loaders/loader';
import { useProfileQuery } from '@data/profile/use-profile.query';
import React from 'react'

export default function ProfilePage() {
    const { data, isLoading: loading, error } = useProfileQuery();
    if (loading) return <Loader text={"common:text-loading"} />;
    if (error) return <ErrorMessage message={error.message} />;

    return (
        <div className='flex flex-col bg-white rounded shadow-sm'>
            <div className='px-[30px] py-6 flex items-center border-b'>
                 <h1 className="text-lg font-semibold text-heading">
                Hồ Sơ Của Tôi
                </h1>
            </div>

            <ProfileUpdateForm user={data?.user} loading={loading}/>
        </div>
    )
}

ProfilePage.authenticate = {
    permissions: ["USER"],
};

ProfilePage.Layout = GetLayoutPageUser