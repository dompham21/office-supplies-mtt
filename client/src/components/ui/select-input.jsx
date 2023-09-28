import Select from "@components/ui/select/select";
import { Controller } from "react-hook-form";


const SelectInput = ({
  id,
  control,
  options,
  name,
  rules,
  value,
  handleOnChange,
  getOptionLabel,
  getOptionValue,
  isMulti,
  isClearable,
  isLoading,
  placeholder,
  className,
  ...rest
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      {...rest}
      render={({ field: { onChange, value } }) => (
        <Select
          className={className}
          id={id}
          value={value}
          onChange={(e) => { 
            if(handleOnChange != null) {
              handleOnChange(e)
            }
            onChange(e)
          }}
          placeholder={placeholder}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isMulti={isMulti}
          isClearable={isClearable}
          isLoading={isLoading}
          options={options}
        />
      )}
    />
  );
};

export default SelectInput;
