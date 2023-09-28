import Head from 'next/head'
import Image from 'next/image'
import getLayout from '@components/layouts/layouts';

import StickySidebarBoxedCategories from '@components/layouts/sticky-sidebar-filter';
import getLayoutPageSearch from '@components/layouts/layout_page_search';
import ListProductWithInfiniteSearchPage from '@components/product/list-product-search-page-with-scroll';
import { Fragment, useEffect, useState } from 'react';
import NotFound from "@components/ui/not-found";
import Scrollbar from "@components/ui/scrollbar";
import { useCategoriesQuery } from "@data/category/use-category.query";
import { CiFilter } from "react-icons/ci";
import { Checkbox, Col, Input, Row, Radio, Space, Slider  } from 'antd';
import InputNumberOnly from "@components/ui/input-number";
import { useProductsSearchInfiniteQuery } from "@data/product/use-product-search-infinite.query";
import { useRouter } from "next/router";
import { useGetMaxPriceQuery } from '@data/product/use-get-max-price.query';
import { currencyMoney } from '@utils/format-currency';
import Loader from '@components/ui/loaders/loader';





export default function Search() {
  const router = useRouter();

  const [value, setValue] = useState(1);
  const [sortField, setSortFiled] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [categoryIds, setCategoryIds] = useState(null)
  const [minPrice, setMinPrice] = useState(null)
  const [maxPrice, setMaxPrice] = useState(null)


  const { error: errorMaxPrice, data: dataMaxPrice,isLoading: isLoadingMaxPrice } = useGetMaxPriceQuery()
  const { error: error ,data: data, isLoading} = useCategoriesQuery();


  const onChange = (checkedValues) => {
    setCategoryIds(checkedValues)
    router.push({
      pathname: router.pathname,
      query: { ...router.query, categoryIds: checkedValues?.join(',')},
    });
  };


  const onChangeRadio = (e) => {
    const { value } = e.target;
  
    switch(value) {
      case 1: 
        setSortFiled("registrationDate")
        setSortDirection("desc")
        router.push({
          pathname: router.pathname,
          query: { ...router.query, sortField: "registrationDate", sortDirection: "desc"},
        });
        break;
      case 2:
        setSortFiled("soldQuantity")
        setSortDirection("desc")
        router.push({
          pathname: router.pathname,
          query: { ...router.query, sortField: "soldQuantity", sortDirection: "desc"},
        });
        break;
      case 3:
        setSortFiled("price")
        setSortDirection("desc")
        router.push({
          pathname: router.pathname,
          query: { ...router.query, sortField: "price", sortDirection: "desc"},
        });
        break;
      case 4:
        setSortFiled("price")
        setSortDirection("asc")
        router.push({
          pathname: router.pathname,
          query: { ...router.query, sortField: "price", sortDirection: "asc"},
        });
        break;
      default:

    }

  };

  const formatter = (value) => {
    if(value === 0 ) return '₫0'
    return currencyMoney(value)
  };

  const onChangeSlider = (value) => {
    if(value && value?.length >= 2) {
      setMinPrice(value[0])
      setMaxPrice(value[1])
      router.push({
        pathname: router.pathname,
        query: { ...router.query, minPrice: value[0], maxPrice: value[1]},
      });
    }
  };


  const handleCategory = () => {
    const currentQuery = router.query;

    const categoryIdsQuery = currentQuery?.categoryIds;
    console.log("🚀 ~ file: search.jsx:117 ~ handleCategory ~ categoryIdsQuery:", categoryIdsQuery)
    if(categoryIdsQuery) {
      const categoryArray = decodeURIComponent(categoryIdsQuery)?.split(',');
      if(Array.isArray(categoryArray)) {
        return categoryArray
      }
      else return null
    }
    else return null
    

  }

  const handlePrice = () => {
    const currentQuery = router.query;

    const minPriceQuery = currentQuery?.minPrice;
    const maxPriceQuery = currentQuery?.maxPrice;

    if(!Number.isNaN(minPriceQuery) && !Number.isNaN(maxPriceQuery) && (maxPriceQuery>=minPriceQuery)) {
      return [minPriceQuery, maxPriceQuery]
    }
    return [0, dataMaxPrice?.price]
  }

  const handleSortFieldAndSortDir = () => {
    const currentQuery = router.query;

    const sortFieldQuery = currentQuery?.sortField;
    const sortDirQuery = currentQuery?.sortDirection;
    
    if(sortFieldQuery && sortDirQuery) {
      if(sortFieldQuery === "registrationDate" && sortDirQuery === "desc") {
        return 1
      }
      else if(sortFieldQuery === "soldQuantity" && sortDirQuery === "desc") {
        return 2
      }
      else if(sortFieldQuery === "price" && sortDirQuery === "desc") {
        return 3;
      }
      else if(sortFieldQuery === "price" && sortDirQuery === "asc") {
        return 4;
      }
    }
    return 1    
  }

  if(isLoadingMaxPrice || isLoading) {
    return <Loader text={"Đang tải"} />
  }

  return (
    <Fragment>
      <aside
        className={`lg:top-22 h-full hidden xl:block bg-light lg:bg-gray-100 basis-[200px]`}
      >
        <div className="h-full p-5">
          <div className="uppercase font-semibold flex items-center gap-1">
            <CiFilter/>
            <span>Bộ lọc tìm kiếm</span>
          </div>
          <div className="my-5">
            <div className="font-medium">Theo danh mục</div>
            <Checkbox.Group style={{ width: '100%' }} onChange={onChange} value={handleCategory()}>
              <Row>
                {
                  data?.categories?.map(cat => (
                    <Col span={24} key={cat.id}>
                      <Checkbox value={cat.id.trim()}>{cat.name}</Checkbox>
                    </Col>
                  ))
                }
              </Row>
            </Checkbox.Group>
          </div>
          {
            dataMaxPrice?.price ? (
              <div className="my-5">
                <div className="font-medium">Theo khoảng giá</div>
                <Slider onChange={onChangeSlider} tooltip={{ formatter }} range  defaultValue={handlePrice()} min={0} max={dataMaxPrice?.price} step={1000}/>
              </div>
            ): null
          }
         
          <div className="my-5">
            <div className="font-medium">Phân loại theo</div>
            <Radio.Group onChange={onChangeRadio}  value={handleSortFieldAndSortDir()}>
              <Space direction="vertical">
                <Radio value={1}>Mới nhất</Radio>
                <Radio value={2}>Bán chạy</Radio>
                <Radio value={3}>Giá giảm dần</Radio>
                <Radio value={4}>Giá tăng dần</Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>
      </aside>
      <div className='w-[calc(100%-200px)] pr-16'>
        <div className="p-4 lg:p-8">
          <ListProductWithInfiniteSearchPage title={"Kết quả tìm kiếm cho từ khoá"} priceMin={minPrice} priceMax={maxPrice} categoryIds={handleCategory()} sortField={sortField} sortDirection={sortDirection} pageSize={20} showPagination={true}/>
        </div>
      </div>
    </Fragment> 
  )
}

Search.Layout = getLayoutPageSearch;