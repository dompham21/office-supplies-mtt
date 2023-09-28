import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdatePosterForm from '@components/poster/create-or-update-poster-form';
import React from 'react'

export default function CreatePosterPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Create poster"}
        </h1>
      </div>
      <CreateOrUpdatePosterForm />
    </>
  )
}

CreatePosterPage.authenticate = {
  permissions: ["ADMIN"],
};

CreatePosterPage.Layout = AdminLayout;

 