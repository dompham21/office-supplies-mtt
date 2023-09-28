import GetLayoutPageUser from '@components/layouts/layout_page_user'
import ChangePasswordForm from '@components/password/change-password-form'
import React from 'react'

export default function PasswordPage() {
    // const { data, isLoading: loading, error } = useProfileQuery();
    // if (loading) return <Loader text={"common:text-loading"} />;
    // if (error) return <ErrorMessage message={error.message} />;

    return (
        <div className='flex flex-col bg-white rounded shadow-sm'>
            <div className='px-[30px] py-6 flex items-center border-b'>
                 <h1 className="text-lg font-semibold text-heading">
                 Đổi Mật Khẩu
                </h1>
            </div>
            <ChangePasswordForm/>

        </div>
    )
}

PasswordPage.authenticate = {
    permissions: ["USER"],
};

PasswordPage.Layout = GetLayoutPageUser