import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdateProductForm from '@components/product/create-or-update-product-form';
import React from 'react'

export default function CreateProductPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Create product"}
        </h1>
      </div>
      <CreateOrUpdateProductForm />
    </>
  )
}

CreateProductPage.authenticate = {
  permissions: ["ADMIN"],
};

CreateProductPage.Layout = AdminLayout;

 