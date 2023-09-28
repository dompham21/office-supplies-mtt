import CloseIcons from "@components/icons/close-icons";
import SearchIcon from "@components/icons/search-icons";
import cn from "classnames";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const classes = {
  root: "ps-10 pe-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0",
  normal:
    "bg-gray-100 border border-border-base focus:shadow focus:bg-light focus:border-accent",
  solid:
    "bg-gray-100 border border-border-100 focus:bg-light focus:border-accent",
  outline: "border border-border-base focus:border-accent",
  shadow: "focus:shadow",
};



const SearchOnChange= ({
  className,
  onSearch,
  variant = "outline",
  shadow = false,
  value,
  onClear,
  inputClassName,
  ...rest
}) => {
  


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
    inputClassName
  );

 
 

  return (
    <div className={cn("w-full flex items-center relative", className)}>
      <button className="outline-none absolute start-1 focus:outline-none active:outline-none p-2 text-body">
        <SearchIcon className="w-5 h-5" />
      </button>
      <input
        type="text"
        id="search"
        className={rootClassName}
        onChange={onSearch}
        value={value}
        placeholder={"Type your query and press enter"}
        aria-label="Search"
        autoComplete="off"
        {...rest}
      />
      {!!value && (
        <button
          type="button"
          onClick={onClear}
          className="outline-none absolute right-1 focus:outline-none active:outline-none p-2 text-body"
        >
          <CloseIcons className="w-5 h-5" />
        </button>
        
      )}
    </div>
  );
};

export default SearchOnChange;
