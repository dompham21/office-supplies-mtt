import cn from 'classnames';
import Button from '@components/ui/button';
import NotFound from '@components/ui/not-found';
import { useTranslation } from 'next-i18next';
import rangeMap from '@utils/rangeMap';
import Pagination from '@components/ui/pagination';
import ProductLoader from '@components/ui/loaders/product-loader';
import { Empty, Spin } from 'antd';


const GridWithLoader = ({
  showLoaders,
  pageSize = 10,
  children,
  notFound,
  showPagination,
  onPagination,
  totalPage, 
  pageNo,
  layout,
}) => {
   

  if(showLoaders) {
    return (
      <div className='flex justify-center items-center mt-10'>
        <Spin size='large'/>
      </div>
    )
  }

  if (notFound) {
    return (
      <Empty/>
    );
  }
 
  return (
    <div className='flex-1 bg-gray-100 pt-6 pb-8 '>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[30px] md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
        {
          children
        }
      </div>
      {showPagination && totalPage && totalPage !== 0 && (
        <div className="flex justify-end items-center">
          <Pagination
            total={totalPage * pageSize}
            current={pageNo}
            pageSize={pageSize}
            onChange={onPagination}
            showLessItems
          />
        </div>
      )}
    </div>
  );
};

export default GridWithLoader;
