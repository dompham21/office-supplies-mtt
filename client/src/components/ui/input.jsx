import React from 'react'
import cn from "classnames";

const classes = {
    root: "px-4 h-10 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0",
    normal:
      "bg-gray-100 border border-border-base focus:shadow focus:bg-light focus:border-accent",
    solid:
      "bg-gray-100 border border-border-100 focus:bg-light focus:border-accent",
    outline: "border border-border-base focus:border-accent",
    shadow: "focus:shadow",
    capitalize: "capitalize"
  };


const Input =  React.forwardRef((props, ref) => {
    const {
        className,
        label,
        note,
        name,
        error,
        children,
        variant = "normal",
        shadow = false,
        capitalize = false,
        type = "text",
        inputClassName,
        ...rest
      } = props
      
    const rootClassName = cn(
      classes.root,
      {
          [classes.normal]: variant === "normal",
          [classes.solid]: variant === "solid",
          [classes.outline]: variant === "outline",
      },
      {
          [classes.shadow]: shadow,
      },
      {
        [classes.capitalize]: capitalize,
      },
      inputClassName
    );
  return (
    <div className={className}> 
        <label
            htmlFor={name}
            className="block text-body-dark font-semibold text-sm leading-none mb-3"
        >
            {label}
        </label>
        <input
          id={name}
          ref={ref}
          name={name}
          type={type}
          className={rootClassName}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-invalid={error ? "true" : "false"}
          {...rest}
        />
         {note && <p className="mt-2 text-xs text-body">{note}</p>}
         {error && (
          <p className="my-2 text-xs text-start text-red-500">{error}</p>
        )}
    </div>
  )
})

Input.displayName = 'MyInput';


export default Input