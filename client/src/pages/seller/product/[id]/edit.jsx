import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdateProductForm from '@components/product/create-or-update-product-form';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loaders/loader';
import { useProductDetailQuery } from '@data/product/use-product-detail.query';
import { useRouter } from 'next/router';
import React from 'react'


export default function UpdateProductPage() {
  const { query } = useRouter();

  const {
    data,
    isLoading: loading,
    error,
  } = useProductDetailQuery(query?.id);
  if (loading) return <Loader text={"Loading"} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Edit product"}
        </h1>
      </div>
      <CreateOrUpdateProductForm initialValues={data?.product} />
    </>
  );
}

UpdateProductPage.authenticate = {
  permissions: ["ADMIN"],
};
UpdateProductPage.Layout = AdminLayout;


