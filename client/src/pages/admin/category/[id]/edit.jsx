import CreateOrUpdateCategoryForm from '@components/categories/create-or-update-category-form';
import AdminLayout from '@components/layouts/admin-layout';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loaders/loader';
import CreateOrUpdateUserForm from '@components/user/create-or-update-user';
import { useCategoryDetailQuery } from '@data/category/admin/use-category-detail.query';
import { useProductDetailQuery } from '@data/product/use-product-detail.query';
import { useUserDetailQuery } from '@data/user/admin/use-user-detail.query';
import { useRouter } from 'next/router';
import React from 'react'
import { useTranslation } from 'react-i18next';


export default function UpdateCategoryPage() {
  const { query } = useRouter();
  const { t } = useTranslation();

  const {
    data,
    isLoading: loading,
    error,
  } = useCategoryDetailQuery(query?.id);
  if (loading) return <Loader text={"common:text-loading"} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {"Edit category"}
        </h1>
      </div>
      <CreateOrUpdateCategoryForm initialValues={data?.category} />
    </>
  );
}

UpdateCategoryPage.authenticate = {
  permissions: ["ADMIN"],
};

UpdateCategoryPage.Layout = AdminLayout;

