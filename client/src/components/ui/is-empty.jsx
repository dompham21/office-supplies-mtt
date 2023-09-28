import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import noResult from '@assets/no-result.svg';
import Image from 'next/image';

const IsEmpty = ({ className, text }) => {
   
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src={noResult}
          alt={text ? text : "Không tìm thấy"}
          className="w-full h-full object-cover"
        />
      </div>
      {text && (
        <h3 className="w-full text-center text-xl font-semibold text-body my-7">
          {text}
        </h3>
      )}
    </div>
  );
};

export default IsEmpty;
