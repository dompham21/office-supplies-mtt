import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdateSupplierForm from '@components/supplier/create-or-update-supplier-form';
import React from 'react'

export default function CreateSupplierPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Thêm mới nhà cung cấp"}
        </h1>
      </div>
      <CreateOrUpdateSupplierForm />
    </>
  )
}

CreateSupplierPage.authenticate = {
  permissions: ["ADMIN"],
};


CreateSupplierPage.Layout = AdminLayout;

 