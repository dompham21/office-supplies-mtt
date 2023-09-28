import CreateOrUpdateBrandForm from '@components/brand/create-or-update-brand-form';
import AdminLayout from '@components/layouts/admin-layout';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loaders/loader';
import { useBrandDetailQuery } from '@data/brand/admin/use-brand-detail.query';
import { useRouter } from 'next/router';
import React from 'react'
import { useTranslation } from 'react-i18next';


export default function UpdateBrandPage() {
  const { query } = useRouter();
  const { t } = useTranslation();

  const {
    data,
    isLoading: loading,
    error,
  } = useBrandDetailQuery(query?.id);
  if (loading) return <Loader text={"common:text-loading"} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Edit brand"}
        </h1>
      </div>
      <CreateOrUpdateBrandForm initialValues={data?.brand} />
    </>
  );
}

UpdateBrandPage.authenticate = {
  permissions: ["ADMIN"],
};

UpdateBrandPage.Layout = AdminLayout;

