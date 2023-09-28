import React from 'react'
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { IoClose, IoSearch } from 'react-icons/io5';

const classes = {
    normal:
      'bg-light ps-6 pe-14 rounded-te-none rounded-be-none  border border-e-0 border-transparent focus:border-accent',
    minimal:
      'bg-gray-100 ps-10 pe-12 md:ps-14 border border-border-200 focus:border-accent focus:bg-light',
};
  
function SearchBox(props) {
    const { className,
            label,
            onSubmit,
            onClearSearch,
            variant = 'normal',
            value,
            ...rest
        } = props

    const { t } = useTranslation();

    

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div
        className={cn(
          'rounded md:rounded-lg flex relative',
          variant === 'normal' ? 'h-14 shadow-900' : 'h-11 md:h-12'
        )}
      >
        <label htmlFor={label} className="sr-only">
          {label}
        </label>

        <input
          id={label}
          type="text"
          value={value}
          autoComplete="off"
          className={cn(
            'w-full h-full flex item-center appearance-none transition duration-300 ease-in-out text-heading text-sm placeholder-gray-500 overflow-hidden rounded-lg focus:outline-none focus:ring-0',
            classes[variant]
          )}
          {...rest}
        />
        {value && (
          <button
            type="button"
            onClick={onClearSearch}
            className={cn(
              'cursor-pointer h-full w-10 md:w-14 flex items-center justify-center absolute text-body transition-colors duration-200 focus:outline-none hover:text-accent-hover focus:text-accent-hover',
              {
                'right-36': variant === 'normal',
                'right-0': variant !== 'normal',
              }
            )}
          >
            <span className="sr-only">{'close'}</span>
            <IoClose className="w-5 h-5" />
          </button>
        )}


        <button className="h-full w-10 md:w-14 flex items-center justify-center absolute start-0 text-body transition-colors duration-200 focus:outline-none hover:text-accent-hover focus:text-accent-hover">
            <span className="sr-only">{'search'}</span>
            <IoSearch className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}

export default SearchBox