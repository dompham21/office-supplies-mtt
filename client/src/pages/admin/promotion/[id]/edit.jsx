import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdatePosterForm from '@components/poster/create-or-update-poster-form';
import CreateOrUpdatePromotionForm from '@components/promotion/create-or-update-promotion-form';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loaders/loader';
import CreateOrUpdateUserForm from '@components/user/create-or-update-user';
import { usePosterDetailQuery } from '@data/poster/admin/use-poster-detail.query';
import { usePromotionDetailQuery } from '@data/promotion/use-promotion-detail.query';
import { useRouter } from 'next/router';
import React from 'react'


export default function UpdatePromotionPage() {
  const { query } = useRouter();

  const {
    data,
    isLoading: loading,
    error,
  } = usePromotionDetailQuery(query?.id);
  if (loading) return <Loader text={"common:text-loading"} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Edit promotion"}
        </h1>
      </div>
      <CreateOrUpdatePromotionForm initialValues={data?.promotion} />
    </>
  );
}

UpdatePromotionPage.authenticate = {
  permissions: ["ADMIN"],
};

UpdatePromotionPage.Layout = AdminLayout;
