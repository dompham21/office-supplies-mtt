import React, { useState } from 'react'
import cn from "classnames";
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
import Link from 'next/link';
const classes = {
  root: "px-4 h-10 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0",
  normal:
    "bg-gray-100 border border-border-base focus:shadow focus:bg-light focus:border-accent",
  solid:
    "bg-gray-100 border border-border-100 focus:bg-light focus:border-accent",
  outline: "border border-border-base focus:border-accent",
  shadow: "focus:shadow",
};

const PasswordInput = React.forwardRef((props, ref) => {
  const [show, setShow] = useState(false);

  const {
    className,
    inputClassName,
    forgotPassHelpText,
    label,
    name,
    error,
    children,
    variant = "normal",
    shadow = false,
    type = "text",
    forgotPageLink = "",
    ...rest
  } = props;

  const rootClassName = cn(
    classes.root,
    {
      [classes.normal]: variant === "normal",
      [classes.solid]: variant === "solid",
      [classes.outline]: variant === "outline",
    },
    shadow == true && classes.shadow,
    inputClassName
  );

  return (
    <div className={className}>
        <div className="flex items-center justify-between mb-3">
          <label
            htmlFor={name}
            className="text-body-dark font-semibold text-sm leading-none"
          >
            {label}
          </label>
        </div>
        <div className="relative">
          <input
            id={name}
            name={name}
            ref={ref}
            type={show ? "text" : "password"}
            className={rootClassName}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            {...rest}
          />
          <label
            htmlFor={name}
            className="absolute right-4 top-5 -mt-2 text-body cursor-pointer"
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? (
              <AiOutlineEyeInvisible className="w-5 h-5" />
            ) : (
              <AiOutlineEye className="w-5 h-5" />
            )}
          </label>
        </div>
        <div className='flex justify-end mt-2'>
          {forgotPageLink && forgotPassHelpText && (
            <Link
              scroll={false}
              href={forgotPageLink}
              className="text-xs text-accent transition-colors duration-200 focus:outline-none focus:text-accent-700 focus:font-semibold hover:text-accent-hover"
            >
              {forgotPassHelpText}
            </Link>
          )}
        </div>
        {error && (
          <p className="my-2 text-xs text-start text-red-500">{error}</p>
        )}
      </div>
  )
})

PasswordInput.displayName = "PasswordInput"

export default PasswordInput