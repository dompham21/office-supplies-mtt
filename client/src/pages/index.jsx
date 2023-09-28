import Head from 'next/head'
import Image from 'next/image'
import Poster from '@components/poster/poster';
import Categories from '@components/categories/categories';
import ListProductHomePage from '@components/product/list-product-home-page';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ListProductWithInfiniteHomePage from '@components/product/list-product-home-page-with-scroll';
import ListProductBestSell from '@components/product/list-product-best-sell';
import ListProductPromotion from '@components/product/list-product-promotion';
import { useProductNewQuery } from '@data/product/use-product-new.query';
import ListProductWithSlider from '@components/product/list-product-with-slider';
import { useProductBestSellQuery } from '@data/product/use-product-best-sell.query';
import { useProductPromotionQuery } from '@data/product/use-product-promotion.query';
import getLayout from '@components/layouts/layouts';



export default function Home() {
  const {
      data: dataProductNew,
      isLoading: loadingProductNew,
      error: errorProductNew,
  } = useProductNewQuery();

  const {
    data: dataProductBestSell,
    isLoading: loadingProductBestSell,
    error: errorProductBestSell,
  } = useProductBestSellQuery();

  const {
    data: dataProductPromotion,
    isLoading: loadingProductPromotion,
    error: errorProductPromotion,
  } = useProductPromotionQuery();


  return (
    <div className="p-4 lg:p-8">
      <Poster/>
      <Categories />
      <ListProductWithSlider title={"Sản phẩm mới nhất"} products={dataProductNew?.products} loading={loadingProductNew} error={errorProductNew}/>
      <ListProductWithSlider title={"Sản phẩm bán chạy nhất"} products={dataProductBestSell?.products} loading={loadingProductBestSell} error={errorProductBestSell}/>
      <ListProductWithSlider title={"Sản phẩm khuyến mãi"} products={dataProductPromotion?.products} loading={loadingProductPromotion} error={errorProductPromotion}/>
      <ListProductWithInfiniteHomePage title={"Tất cả sản phẩm"} sortField={"id"} sortDirection={"desc"} pageSize={10} showPagination={true}/>
    </div>
  )
}

Home.Layout = getLayout;