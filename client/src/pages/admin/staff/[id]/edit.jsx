import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdateStaffForm from '@components/staff/create-or-update-staff-form';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loaders/loader';
import CreateOrUpdateUserForm from '@components/user/create-or-update-user';
import { useProductDetailQuery } from '@data/product/use-product-detail.query';
import { useStaffDetailQuery } from '@data/staff/use-staff-detail.query';
import { useUserDetailQuery } from '@data/user/admin/use-user-detail.query';
import { useRouter } from 'next/router';
import React from 'react'


export default function UpdateUserPage() {
  const { query } = useRouter();

  const {
    data,
    isLoading: loading,
    error,
  } = useStaffDetailQuery(query?.id);
  if (loading) return <Loader text={"common:text-loading"} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Edit user"}
        </h1>
      </div>
      <CreateOrUpdateStaffForm initialValues={data?.user} />
    </>
  );
}

UpdateUserPage.authenticate = {
  permissions: ["ADMIN"],
};

UpdateUserPage.Layout = AdminLayout;

