import AdminLayout from '@components/layouts/admin-layout';
import CreateOrUpdatePosterForm from '@components/poster/create-or-update-poster-form';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loaders/loader';
import CreateOrUpdateUserForm from '@components/user/create-or-update-user';
import { usePosterDetailQuery } from '@data/poster/admin/use-poster-detail.query';
import { useRouter } from 'next/router';
import React from 'react'


export default function UpdatePosterPage() {
  const { query } = useRouter();

  const {
    data,
    isLoading: loading,
    error,
  } = usePosterDetailQuery(query?.id);
  if (loading) return <Loader text={"common:text-loading"} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Edit poster"}
        </h1>
      </div>
      <CreateOrUpdatePosterForm initialValues={data?.poster} />
    </>
  );
}

UpdatePosterPage.authenticate = {
  permissions: ["ADMIN"],
};

UpdatePosterPage.Layout = AdminLayout;

