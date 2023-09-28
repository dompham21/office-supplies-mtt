import CreateOrUpdateCategoryForm from '@components/categories/create-or-update-category-form';
import AdminLayout from '@components/layouts/admin-layout';
import React from 'react'

export default function CreateCategoryPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Create category"}
        </h1>
      </div>
      <CreateOrUpdateCategoryForm />
    </>
  )
}

CreateCategoryPage.authenticate = {
  permissions: ["ADMIN"],
};

CreateCategoryPage.Layout = AdminLayout;

 