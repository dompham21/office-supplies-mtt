import React from 'react'
import { useRouter } from 'next/router'
import { useProductDetailQuery } from '@data/product/use-product-detail.query';
import Loader from '@components/ui/loaders/loader';
import ErrorMessage from '@components/ui/error-message';
import NotFound from '@components/ui/not-found';
import getLayout from '@components/layouts/layouts';
import Details from '@components/product/details/details';
import { useProfileQuery } from '@data/profile/use-profile.query';

function ProductDetail() {
  const { query } = useRouter();

  const {
    data,
    isLoading: loading,
    error,
  } = useProductDetailQuery(query?.id)


  if (loading) return <Loader text="Loading"/>;
  if (error) return  <NotFound text="text-not-found" className="w-7/12 mx-auto" />

  return (
    <div className="lg:mx-14  mt-10 xl:mx-20 min-h-screen">
       {
        query?.id ? <Details product={data?.product} /> : null
       }
    </div>
  )
}




ProductDetail.Layout = getLayout;

export default ProductDetail