import { useTranslation } from "next-i18next";
import cn from "classnames";
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'

const AddToCartBtn = ({ className, onClick, disabled }) => {
  const { t } = useTranslation("common");

  
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
            "py-4 px-5 w-52 flex items-center justify-center text-sm lg:text-base font-light rounded text-light bg-accent hover:bg-accent-hover transition-colors duration-300 focus:outline-none focus:bg-accent-hover",
            {
                "border !bg-gray-300 hover:!bg-gray-300 border-border-400 !text-body cursor-not-allowed":
                disabled,
            },
            className
            )}
        >
            <span>Thêm vào giỏ hàng</span>
        </button>
    );
};

export default AddToCartBtn;
