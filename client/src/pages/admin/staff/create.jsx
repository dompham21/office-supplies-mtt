import AdminLayout from '@components/layouts/admin-layout';
import React from 'react'

export default function CreateUserPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Create user"}
        </h1>
      </div>
      {/* <CreateOrUpdateProductForm /> */}
    </>
  )
}

CreateUserPage.authenticate = {
  permissions: ["ADMIN"],
};

CreateUserPage.Layout = AdminLayout;

 