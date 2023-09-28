import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { default as productPlaceholder } from '@assets/placeholders/product.svg';
import Image from 'next/image';
import { currencyMoney } from '@utils/format-currency';
import { formatSoldQuantity } from '@utils/format-sold-quantity';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ProductCard = ({ product }) => {
     
    const { id, name, images, inStock, soldQuantity, price, priceAfterDiscount, discount } = product

    const router = useRouter();

  return (
    <article className='relative cart-type-helium rounded border border-border-200 h-full bg-light overflow-hidden transition-shadow duration-200 hover:shadow-sm hover:border-accent hover:translate-y-[-0.0625rem]'>
        {discount && (
          <div className="absolute z-50 top-3 left-3 rounded text-xs leading-6 font-semibold px-1.5 md:px-2 lg:px-2.5 bg-accent text-light">
            {discount}%
          </div>
        )}
        <Link href={`/products/${id}`}>
            <div
                className="relative flex items-center justify-center w-auto h-48 sm:h-64"
                role="button"
            >
                <Image
                    src={images && images.length > 0 ? images[0] : productPlaceholder}
                    alt={name}
                    fill="true"
                    className="product-image object-cover"
                />
            </div>
            {/* End of product image */}

            <header className="p-3 md:py-6 md:p-5 relative">
                <h3
                role="button"
                className="h-10 text-heading text-sm font-semibold line-clamp-2 text-ellipsis mb-2 text-left"
                >
                {name}
                </h3>
                {/* End of product info */}

                <div className="flex items-center justify-between min-h-6 mt-4 relative">
                
                    <div className="relative">
                        {
                            discount && priceAfterDiscount ? (
                                <>
                                    <del className="text-xs text-muted text-opacity-75 absolute -top-4 md:-top-5 italic">
                                        {currencyMoney(price)}
                                    </del>

                                    <span className="text-accent text-sm md:text-base font-semibold">
                                        {currencyMoney(priceAfterDiscount)}
                                    </span>
                                </>
                                
                            ) :
                            <span className="text-accent text-sm md:text-base font-semibold">
                                {currencyMoney(price)}
                            </span>

                        }
                       
                        
                    </div>

                    {Number(inStock) > 0 && Number(soldQuantity) > 0 &&  (
                        <div className="text-muted text-xs">
                            Đã bán {formatSoldQuantity(soldQuantity)}
                        </div>
                    )}

                {Number(inStock) <= 0 && (
                    <div className="bg-red-500 rounded text-xs text-light px-2 py-1">
                    {'Hết hàng'}
                    </div>
                )}
                {/* End of product price */}
                </div>
            </header>
        </Link>
    </article>
)};

export default ProductCard;
