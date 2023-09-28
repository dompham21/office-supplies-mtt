import React from 'react'
import cn from "classnames";
import {IoClose} from "react-icons/io5";

const variantClasses = {
    info: "bg-blue-100 text-blue-600",
    warning: "bg-yellow-100 text-yellow-600",
    error: "bg-red-100 text-red-500",
    success: "bg-green-100 text-accent",
    infoOutline: "border border-blue-200 text-blue-600",
    warningOutline: "border border-yellow-200 text-yellow-600",
    errorOutline: "border border-red-200 text-red-600",
    successOutline: "border border-green-200 text-green-600",
  };

function Alert({
  message = "",
  closeable = false,
  variant = "info",
  className,
  onClose,
}) {
  return (
    <div
    className={cn(
      "flex items-center justify-between relative rounded py-4 px-5 shadow-sm",
      variantClasses[variant],
      className
    )}
    role="alert"
  >
    <p className="text-sm mb-0">{message}</p>
    {closeable && (
      <button
        data-dismiss="alert"
        aria-label="Close"
        onClick={onClose}
        title="Close alert"
        className="-mt-1 flex items-center justify-center rounded-full flex-shrink-0 w-6 h-6 text-red-500 absolute right-1 top-2 transition-colors duration-200 hover:bg-gray-300 hover:bg-opacity-25 focus:outline-none focus:bg-gray-300 focus:bg-opacity-25"
      >
        <span aria-hidden="true">
          <IoClose className="w-4 h-4 text-black" />
        </span>
      </button>
    )}
  </div>
  )
}

export default Alert;