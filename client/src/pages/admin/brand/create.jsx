import CreateOrUpdateBrandForm from '@components/brand/create-or-update-brand-form';
import AdminLayout from '@components/layouts/admin-layout';
import React from 'react'

export default function CreateBrandPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Create brand"}
        </h1>
      </div>
      <CreateOrUpdateBrandForm />
    </>
  )
}

CreateBrandPage.authenticate = {
  permissions: ["ADMIN"],
};


CreateBrandPage.Layout = AdminLayout;

 