import React from 'react'
import cn from "classnames";

const classes = {
    root: "inline-flex items-center justify-center flex-shrink-0 font-semibold leading-none rounded outline-none transition duration-300 ease-in-out focus:outline-none focus:shadow",
    normal:
      "bg-accent text-light border border-transparent hover:bg-accent-hover",
    custom: "border border-border-400 text-body",
    outline:
      "border border-border-400 bg-transparent text-body  hover:border-accent",
    loading:
      "h-4 w-4 ms-2 rounded-full border-2 border-transparent border-t-2 animate-spin",
    disabled:
      "border border-border-base bg-gray-300 border-border-400 text-body cursor-not-allowed",
    disabledOutline: "border border-border-base text-muted cursor-not-allowed",
    small: "px-3 py-0 h-9 text-sm h-10",
    medium: "px-5 py-0 h-12",
    big: "px-10 py-0 h-14",
};


const Button = React.forwardRef((props, ref) => {
    const {
        className,
        variant = "normal",
        size = "medium",
        children,
        active,
        loading = false,
        disabled = false,
        ...rest
      } = props;

      const classesName = cn(
        classes.root,
        {
          [classes.normal]: !disabled && variant === "normal",
          [classes.disabled]: disabled && variant === "normal",
          [classes.outline]: !disabled && variant === "outline",
          [classes.custom]: !disabled && variant === "custom",
          [classes.disabledOutline]: disabled && variant === "outline",
          [classes.small]: size === "small",
          [classes.medium]: size === "medium",
          [classes.big]: size === "big",
        },
        className
      );
      return (
        <button
          ref={ref}
          aria-pressed={active}
          data-variant={variant}
          className={classesName}
          disabled={disabled}
          {...rest}
        >
          {children}
          {loading && (
            <span
              className={classes.loading}
              style={{
                borderTopColor:
                  variant === "outline" ? "currentColor" : "#ffffff",
              }}
            />
          )}
        </button>
      );
});
Button.displayName = 'MyButton';

export default Button