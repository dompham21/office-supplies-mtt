import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdateSupplierForm from '@components/supplier/create-or-update-supplier-form';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loaders/loader';
import { useSupplierDetailQuery } from '@data/supplier/admin/use-supplier-detail.query';
import { useRouter } from 'next/router';
import React from 'react'
import { useTranslation } from 'react-i18next';


export default function UpdateSupplierPage() {
  const { query } = useRouter();
  const { t } = useTranslation();

  const {
    data,
    isLoading: loading,
    error,
  } = useSupplierDetailQuery(query?.id);
  if (loading)
  return <Loader text={"Loading"} />;
if (error) return <ErrorMessage message={error?.response?.data?.msg} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Chỉnh sửa nhà cung cấp"}
        </h1>
      </div>
      <CreateOrUpdateSupplierForm initialValues={data?.supplier} />
    </>
  );
}

UpdateSupplierPage.authenticate = {
  permissions: ["ADMIN"],
};

UpdateSupplierPage.Layout = AdminLayout;

