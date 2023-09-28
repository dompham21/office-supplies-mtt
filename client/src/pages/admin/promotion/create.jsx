import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdatePosterForm from '@components/poster/create-or-update-poster-form';
import CreateOrUpdatePromotionForm from '@components/promotion/create-or-update-promotion-form';
import React from 'react'

export default function CreatePromotionPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Create promotion"}
        </h1>
      </div>
      <CreateOrUpdatePromotionForm />
    </>
  )
}

CreatePromotionPage.authenticate = {
  permissions: ["ADMIN"],
};

CreatePromotionPage.Layout = AdminLayout;

 