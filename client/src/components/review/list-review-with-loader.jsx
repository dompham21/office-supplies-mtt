import cn from 'classnames';
import Button from '@components/ui/button';
import IsEmpty from '@components/ui/is-empty';
import NotFound from '@components/ui/not-found';
import { useTranslation } from 'next-i18next';
import rangeMap from '@utils/rangeMap';
import Pagination from '@components/ui/pagination';
import ReviewLoader from '@components/ui/loaders/review-loader';
import ProductLoader from '@components/ui/loaders/product-loader';
import { Empty } from 'antd';

const ListReviewWithLoader = ({
  showLoaders,
  pageSize = 10,
  children,
  notFound,
  showPagination,
  onPagination,
  totalPage, 
  pageNo,
  isEmpty,
  layout,
}) => {
  
   
  if (notFound) {
    return (
      <Empty/>
    );
  }
  if(isEmpty) {
    return (
      <Empty/>
    )
   
  }
  return (
    <div className='flex-1 '>
      <div>
      {showLoaders ? (
          <>
            {rangeMap(pageSize, (i) => (
              <ReviewLoader key={i} uniqueKey={`product-${i}`} />
            ))}
          </>
        ) : (
          children
        )}
      </div>
      
      {showPagination && totalPage && totalPage !== 0 ? (
        <div className="flex justify-end items-center mt-2">
          <Pagination
            total={totalPage * pageSize}
            current={pageNo}
            pageSize={pageSize}
            onChange={onPagination}
            showLessItems
          />
        </div>
      ) : null } 
    </div>
  );
};

export default ListReviewWithLoader;
