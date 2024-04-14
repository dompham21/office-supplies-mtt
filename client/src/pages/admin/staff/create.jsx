import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdateStaffForm from '@components/staff/create-or-update-staff-form';
import React from 'react'

export default function CreateStaffPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Thêm mới staff"}
        </h1>
      </div>
      <CreateOrUpdateStaffForm />
    </>
  )
}

CreateStaffPage.authenticate = {
  permissions: ["ADMIN"],
};

CreateStaffPage.Layout = AdminLayout;

 