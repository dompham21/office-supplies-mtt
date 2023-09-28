import cn from 'classnames';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { useTranslation } from 'next-i18next';
import Input from '@components/ui/input';


const Counter = ({
  value,
  onDecrement,
  onIncrement,
  className,
  disabled,
}) => {
   

  return (
    <div
      className={cn('overflow-hidden w-52 h-14 rounded text-light bg-accent inline-flex justify-between', className)}
    >
      <button
        onClick={onDecrement}
        className={'cursor-pointer p-2 transition-colors duration-200 focus:outline-none hover:bg-accent-hover px-5'}
      >
        <span className="sr-only">{'text-minus'}</span>
        <AiOutlineMinus className="h-3 w-3 stroke-2.5" />
      </button>
      <Input
        type="number"
        inputClassName="text-center"
        // value={value}
      />
      <div
        className={'flex-1 flex items-center justify-center text-sm font-semibold'}
      >
        {value}
      </div>
      <button
        onClick={onIncrement}
        disabled={disabled}
        className={'cursor-pointer p-2 transition-colors duration-200 focus:outline-none hover:bg-accent-hover px-5'}
        title={disabled ? "Hết hàng" : ''}
      >
        <span className="sr-only">{'text-plus'}</span>
        <AiOutlinePlus className="h-3.5 w-3.5 md:h-4.5 md:w-4.5 stroke-2.5" />
      </button>
    </div>
  );
};

export default Counter;
