import AdminLayout from '@components/layouts/admin-layout';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loaders/loader';
import CreateOrUpdateUserForm from '@components/user/create-or-update-user';
import ViewCustomerDetail from '@components/user/view-customer-detail';
import { useProductDetailQuery } from '@data/product/use-product-detail.query';
import { useCustomerDetailQuery } from '@data/user/admin/use-customer-detail.query';
import { useUserDetailQuery } from '@data/user/admin/use-user-detail.query';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import React from 'react'
import { ArrowLeftOutlined} from '@ant-design/icons';


export default function ViewCustomerPage() {
  const { query } = useRouter();
  const {
    data,
    isLoading: loading,
    error,
  } = useCustomerDetailQuery(query?.id);
  if (loading) return <Loader text={"Loading"} />;
  if (error) return <ErrorMessage message={error?.response?.data?.msg} />;
  return (
    <>
      <div>
        <Button className='mb-4 flex items-center' type='primary' onClick={()=>history.back()} icon={<ArrowLeftOutlined />}>Quay lại</Button>
      </div>
      <ViewCustomerDetail initialValues={data?.user} />
    </>
  );
}

ViewCustomerPage.authenticate = {
  permissions: ["ADMIN"],
};

ViewCustomerPage.Layout = AdminLayout;

