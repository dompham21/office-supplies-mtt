import cn from 'classnames';
import Button from '@components/ui/button';
import NotFound from '@components/ui/not-found';
import { useTranslation } from 'next-i18next';
import rangeMap from '@utils/rangeMap';
import Pagination from '@components/ui/pagination';
import ProductLoader from '@components/ui/loaders/product-loader';
import Swiper from 'swiper';
import { Empty } from 'antd';


const GridSlide = ({
  showLoaders,
  children,
  notFound,
}) => {

  if (notFound) {
    return (
      <Empty/>
    );
  }
  return (
    <div className='flex-1 bg-gray-100 pt-6 pb-8 '>
        <div className='relative pt-4'>
            {showLoaders ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">

                {rangeMap(10, (i) => (
                <ProductLoader key={i} uniqueKey={`product-${i}`} />
                ))}
            </div>
            ) : (
                children
            )}
        </div>
    </div>
  );
};

export default GridSlide;
