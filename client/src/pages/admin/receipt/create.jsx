import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdateReceiptForm from '@components/receipt/create-or-update-receipt-form';
import React from 'react'

export default function CreateReceiptPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Thêm mới phiếu nhập"}
        </h1>
      </div>
      <CreateOrUpdateReceiptForm />
    </>
  )
}

CreateReceiptPage.authenticate = {
  permissions: ["ADMIN"],
};

CreateReceiptPage.Layout = AdminLayout;

 