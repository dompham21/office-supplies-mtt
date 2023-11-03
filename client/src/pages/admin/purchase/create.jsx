import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdatePurchaseForm from '@components/purchase/create-purchase-form';
import React from 'react'

export default function CreatePurchasePage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Thêm mới phiếu đặt"}
        </h1>
      </div>
      <CreateOrUpdatePurchaseForm />
    </>
  )
}

CreatePurchasePage.authenticate = {
  permissions: ["ADMIN"],
};

CreatePurchasePage.Layout = AdminLayout;

 