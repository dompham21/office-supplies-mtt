import cn from 'classnames';
import Button from '@components/ui/button';
import IsEmpty from '@components/ui/is-empty';
import NotFound from '@components/ui/not-found';
import rangeMap from '@utils/rangeMap';
import Pagination from '@components/ui/pagination';
import AddressLoader from '@components/ui/loaders/address-loader';
import Image from 'next/image';
import { default as cartEmpty } from '@assets/cart-empty.png';

const ListAddressWithLoader = ({
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
      <div className="bg-gray-100 w-full min-h-full pt-6 pb-8 px-4 lg:p-8">
        <NotFound text="text-not-found" className="w-7/12 mx-auto" />
      </div>
    );
  }
  if(isEmpty) {
    return (
        <div className="w-full flex flex-col justify-center items-center py-16" >
        {/* <NotFound text="Chưa có đánh giá" className="w-7/12 mx-auto" /> */}
        <Image src={cartEmpty} width={100} height={100} alt={"cart empty"}/>
        <div className='mt-4 text-base text-trans-40 font-bold'>Dia chi của bạn còn trống</div>
        </div>
    )
  }
  return (
    <div className='flex-1 '>
      <div>
      {showLoaders ? (
          <>
            {rangeMap(pageSize, (i) => (
              <AddressLoader className="mb-3" key={i} uniqueKey={`address-${i}`} />
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

export default ListAddressWithLoader;
