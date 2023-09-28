import { useTranslation } from 'next-i18next';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Badge from '@components/ui/badge';

const CartCounterButton = () => {
  const { t } = useTranslation();
 

  return (
    <button className="relative lg:flex flex-col items-center justify-center z-40 text-right">
      <span className="flex items-center  text-3xl">
        <AiOutlineShoppingCart />
      </span>
      <Badge color={"bg-accent"} textColor={"text-white"} text={"9"} className="absolute -top-4 -right-4 px-2.5"/>
      
    </button>
  );
};

export default CartCounterButton;
